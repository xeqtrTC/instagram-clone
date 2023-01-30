from django.core.mail import send_mail
from base64 import urlsafe_b64decode, urlsafe_b64encode
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
import jwt
import random


def send_token_via_email(email):
    tokenjwt = jwt.encode({
        'email': email,
    }, settings.SECRET_KEY, algorithm='HS512')

    encodedToken = urlsafe_b64encode(str(tokenjwt).encode('utf-8'))
    print(encodedToken)
    subject = 'Your account verification'
    # num = range(0, 10)
    # lst = random.sample(num, 6)
    # test = str(lst).strip('[]')

    # acabes = str(test).replace(',', '')
    # testahes = acabes.strip()
    # print(testahes)
    
    message = f"You need to verificate your email, click on this <a href='http://127.0.0.1:5173/verifyemail/{encodedToken}'>click here</a"
    tokendecoded = jwt.decode(tokenjwt, settings.SECRET_KEY, algorithms='HS512')
    email_from = settings.EMAIL_HOST

    send_mail(subject, message, email_from, [email])