# Overrides the required settings to run using mod_wsgi as configured
# in ../wsgi/example.wsgi
#
# NOTE this file has not been maintained, and is probably not usable,
# however it is kept until we make a proper production project example


from settings import *

DEBUG = False

DEVILRY_MAIN_PAGE = '/django/example/'
LOGIN_URL = '/django/example/'
DEVILRY_LOGOUT_URL = None
DEVILRY_STATIC_URL = '/static'
ADMIN_MEDIA_PREFIX = DEVILRY_STATIC_URL + '/superadminmedia/'

MIDDLEWARE_CLASSES = MIDDLEWARE_CLASSES + [
    # Authentication against the REMOTE_USER environment variable.
    'django.contrib.auth.middleware.RemoteUserMiddleware',
]

# Authentication against the REMOTE_USER environment variable.
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.RemoteUserBackend',
)

DEVILRY_DELIVERY_STORE_BACKEND = 'devilry.core.deliverystore.FsDeliveryStore'
DELIVERY_STORE_ROOT = '/devilry/upload'
