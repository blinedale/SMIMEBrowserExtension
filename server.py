# from subprocess import run, PIPE
import subprocess

def lambda_handler(event, context):

    # get signature from payload
    # signature = 'testsignature blabla'

    # get email from payload
    email = "tsergium@gmail.com";

    client_certificate_subject_line = 'subject=/emailAddress=' + email;

    randomNumber = '5'

    signatureInfileName = '/tmp/signature' + randomNumber;
    signatureOutfileName = '/tmp/signatureDecoded' + randomNumber;
    # cliOutput = [];

    clientCertificatePath = '/tmp/clientCert.pem' + randomNumber;
    issuerCertificatePath = '/tmp/issuerCert.pem' + randomNumber;

    # write signature to file
    # write_to_file(signatureInfileName, signature)

    output = subprocess.check_output('cat /tmp/stuff', shell=True)

    subprocess.check_output('cat %s | base64 --decode > %s' % (signatureInfileName, signatureOutfileName), shell=True)
    cli_output = subprocess.check_output('openssl pkcs7 -in %s -inform DER -print_certs' % (signatureOutfileName), shell=True, universal_newlines=True)
    # print('got something')
    # print(cli_output)

    cli_output = cli_output.split("\n")
    
    client_certificate_array = find_certificate_with_subject_line(cli_output, client_certificate_subject_line)
    print(client_certificate_array)
    


def write_to_file(path, data):
    file = open(path, 'w')
    file.write(data)
    file.close()

def find_certificate_with_subject_line(cli_output, certificate_subject_line):

    # Find certificate subject line    
    try:
        start_index = cli_output.index(certificate_subject_line)
    except ValueError:
        print('Failed to find certificate in signature.')
        raise
    
    # Cut everything before this point...
    sliced_list = cli_output[start_index:]

    # ...so we can find the first relevant -----END CERTIFICATE---- string
    end_index = sliced_list.index('-----END CERTIFICATE-----')

    certificate_array = sliced_list[start_index:end_index+1]

    return certificate_array



print('hello')
lambda_handler(None, None)    
# find_certificate_with_subject_line(['a', 'b'], 'c')