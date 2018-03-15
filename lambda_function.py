import json
import http
import base64
import logging
from ocsp_request import ocsp_request

def lambda_handler(event, context):
    """
    Fetches the S/MIME signature from the request body
     verifies it using openssl and returns a response
    :param event:
    :param context:
    :return:
    """

    if 'body' in event:
        raw_json = json.loads(event['body'])
    else:
        raw_json = event

    status_code = http.HTTPStatus.BAD_REQUEST.value
    response = http.HTTPStatus.BAD_REQUEST.phrase
    if 'signature' in raw_json:
        signature = raw_json['signature']

        client_certificate_serial_number, ocsp_result = ocsp_request(signature)

        status_code = http.HTTPStatus.OK.value
        response = {
            'client_certificate_serial_number' : client_certificate_serial_number,
            'ocsp_result' : ocsp_result
        }

    return api_gateway_response(status_code, response)


def api_gateway_response(status_code, response):
    return {
        'isBase64Encoded': False,
        'statusCode': status_code,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(response)
    }
