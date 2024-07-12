from flask import Flask
from flask import request
from flask_restx import Resource, Api
from flask_restx import fields
import requests
from flask_restx import reqparse
from flask_restx import Namespace

app = Flask(__name__)
api = Api(app)
parking_ns = Namespace('parking', description='Parking operations')
booking_ns = Namespace('booking', description='Barking operations')

api.add_namespace(parking_ns)
api.add_namespace(booking_ns)

parking_model = api.model('Parking', {
    'host_email': fields.String,
    'location': fields.String,
    'title': fields.String,
    'description': fields.String,
    'spot_type': fields.String,
    'features': fields.String,
    'hourly': fields.Boolean,
    'daily': fields.Boolean,
    'monthly': fields.Boolean,
    'price_hour': fields.Integer,
    'price_daily': fields.Integer,
    'price_monthly': fields.Integer,
    'parking_space_height': fields.Float,
    'parking_space_width': fields.Float,
    'parking_space_length': fields.Float
})

booking_model = api.model('Booking', {
    'user_email': fields.String,
    'parking_id': fields.String,
    'start_date': fields.Date,
    'end_date': fields.Date,
    'start_time': fields.String,
    'end_time': fields.String,
    'price': fields.Float
})

parser_id = reqparse.RequestParser()
parser_id.add_argument('id', type=str)

@parking_ns.route('/parking/all')
class Parkings(Resource):
    def get(self):
        r = requests.get('http://localhost:8000/parking/all/')
        return r.json(), r.status_code
    
@parking_ns.route('/parking/create')
class ParkingCreate(Resource):
    @api.expect(parking_model)
    def post(self):
        r = requests.post('http://localhost:8000/parking/create/', api.payload)
        return r.json(), r.status_code

id_model= api.model('parking_id', {
    'parking_id': fields.String,
})
@parking_ns.route('/parking/byid')
class ParkingByid(Resource):
    @api.expect(id_model)
    def post(self):
        # args = parser_id.parse_args()
        # id = args.get('id')
        # r = requests.post('http://localhost:8000/parking/byid/', {"parking_id": id})
        r = requests.post('http://localhost:8000/parking/byid/', api.payload)
        return r.json(), r.status_code

publish_model= api.model('publish_model', {
    'parking_id': fields.String,
    'publish': fields.Boolean
})
@parking_ns.route('/parking/publish')
class ParkingPublish(Resource):
    @api.expect(publish_model)
    def post(self):
        r = requests.post('http://localhost:8000/parking/publish/', api.payload)
        return r.json(), r.status_code


@booking_ns.route('/booking/all')
class Bookings(Resource):
    def get(self):
        r = requests.get('http://localhost:8000/booking/all/')
        return r.json(), r.status_code

@booking_ns.route('/booking/create')
class BookingCreate(Resource):
    @api.expect(booking_model)
    def post(self):
        r = requests.post('http://localhost:8000/booking/create/', api.payload)
        return r.json(), r.status_code   

email_model = api.model('user_email', {
    'user_email': fields.String,
})
@booking_ns.route('/booking/user')
class BookingByUser(Resource):
    @api.expect(email_model)
    def post(self):
        r = requests.post('http://localhost:8000/booking/user/', api.payload)
        return r.json(), r.status_code   

booking_id_model = api.model('booking_id', {
    'booking_id': fields.String,
})
@booking_ns.route('/booking/delete')
class BookingDelete(Resource):
    @api.expect(booking_id_model)
    def put(self):
        r = requests.put('http://localhost:8000/booking/delete/', api.payload)
        # print(api.payload)
        return r.json(), r.status_code   




if __name__ == '__main__':
    app.run(debug=True)
