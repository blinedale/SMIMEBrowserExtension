# This script requires Python >= 3.5
import subprocess
import os
import random
import re

def lambda_handler(event, context):
    '''
    Expects a Base64 encoded S/MIME signature in text form inside the payload.
    The signature is decoded and the X509 certificates inside are extracted.
    An OCSP check is then performed on the signer's certificate.
    All of this is done using OpenSSL calls on the shell. 
    '''

    # TODO: random_suffix = generate_random_suffix()
    random_suffix = '9'

    signature_raw_path = '/tmp/signature%s' % (random_suffix);
    signature_decoded_path = '/tmp/signatureDecoded%s' % (random_suffix);

    client_certificate_path = '/tmp/clientCert%s.pem' % (random_suffix);
    issuer_certificate_path = '/tmp/issuerCert%s.pem' % (random_suffix);

    # get signature from payload
    # signature = 'testsignature blabla'

    # write signature to file
    # write_to_file(signature_raw_path, signature)

    exec_and_return_array('cat %s | base64 --decode > %s' % (signature_raw_path, signature_decoded_path))
    cli_output = exec_and_return_array('openssl pkcs7 -in %s -inform DER -print_certs' % (signature_decoded_path))

    # Parse client and issuer certificates
    client_certificate_subject_pattern = 'subject=.*/emailAddress=.+';
    client_certificate_array = find_certificate_with_subject_line_pattern(cli_output, client_certificate_subject_pattern)

    issuer_string = find_issuer_in_certificate(client_certificate_array)
    issuer_certificate_subject = issuer_string.replace('issuer=', 'subject=')
    issuer_certificate_array = find_certificate_with_subject_line_pattern(cli_output, issuer_certificate_subject)

    # Write certificates to disk
    write_to_file(client_certificate_path, '\n'.join(client_certificate_array))
    write_to_file(issuer_certificate_path, '\n'.join(issuer_certificate_array))

    # Find client certificate serial number
    cli_output = exec_and_return_array('openssl x509 -in %s -noout -serial' % (client_certificate_path))
    client_certificate_serial_number = cli_output[0].replace('serial=', '')

    # Find OCSP URL
    cli_output = exec_and_return_array('openssl x509 -noout -ocsp_uri -in %s' % (client_certificate_path))
    ocsp_url = cli_output[0];
    
    # Perform OCSP call and parse response
    cli_output = exec_and_return_array('openssl ocsp -issuer %s -cert %s -url %s' % (issuer_certificate_path, client_certificate_path, ocsp_url))
    ocsp_result = parse_ocsp_response(cli_output, client_certificate_path)
    
    # Cleaning up files
    os.remove(client_certificate_path)
    os.remove(issuer_certificate_path)
    os.remove(signature_decoded_path)
    # TODO: Remove signature file: os.remove(signature_raw_path)

    # TODO: Build response and return it
    return [client_certificate_serial_number, ocsp_result]

    
def parse_ocsp_response(cli_output, certificate_path):

    # Looking for something like '[certificate path]: revoked/good'
    prefix = certificate_path + ": "

    for line in cli_output:
        if (line.startswith(prefix)):
            return line.replace(prefix, '')

    # Could not find the results string
    return 'unauthorized'        

def exec_and_return_array(command_string):
    cli_output = subprocess.check_output(command_string, shell=True, universal_newlines=True)
    return cli_output.split('\n')

def write_to_file(path, data):
    file = open(path, 'w')
    file.write(data)
    file.close()

def find_certificate_with_subject_line_pattern(cli_output, pattern):

    subject_line_index = -1

    for index, line in enumerate(cli_output):
        if re.search(pattern, line):
            subject_line_index = index
            break
   
    if subject_line_index == -1:
        raise ValueError('Failed to find certificate in signature.')
    
    # Cut everything before this point...
    sliced_list = cli_output[subject_line_index:]

    # ...so we can find the first relevant END CERTIFICATE string
    end_index = sliced_list.index('-----END CERTIFICATE-----')

    certificate_array = sliced_list[:end_index+1]

    return certificate_array

def find_issuer_in_certificate(certificate_array):

    for line in certificate_array:
        if line.startswith('issuer='):
            return line

    return ''

def generate_random_suffix():
    return str(random.randint(0, 1000000))



print('hello world')
ocsp_result = lambda_handler(None, None)
print(ocsp_result)