from os.path import abspath, dirname, join
from devilry.defaults.settings import *

this_dir = dirname(abspath(__file__))

LANGUAGE_CODE = 'nb'

DATABASES = {
    "default": {
        'ENGINE': 'django.db.backends.sqlite3',  # 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': join(this_dir, 'db.sqlite3'),    # Or path to database file if using sqlite3.
        'USER': '',             # Not used with sqlite3.
        'PASSWORD': '',         # Not used with sqlite3.
        'HOST': '',             # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',             # Set to empty string for default. Not used with sqlite3.
        },
    #"postgres": {
    #'ENGINE': 'postgresql_psycopg2',  # 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
    #'NAME': 'devilry',
    #'USER': 'devilrydev',
    #'PASSWORD': 'secret',
    #'HOST': '',             # Set to empty string for localhost. Not used with sqlite3.
    #'PORT': '',             # Set to empty string for default. Not used with sqlite3.
    #}
    }

INSTALLED_APPS += [
    'trix.apps.trix',
    
    # Not apps, but here for the Django test system to discover them:
    'devilry.utils',
    'devilry.restful',
    'devilry.simplified']


INTERNAL_IPS = ["127.0.0.1"]
DEBUG = True
TEMPLATE_DEBUG = DEBUG

# Make this unique, and don't share it with anybody.
SECRET_KEY = '+g$%**q(w78xqa_2)(_+%v8d)he-b_^@d*pqhq!#2p*a7*9e9h'

# If no admins are set, no emails are sent to admins
ADMINS = (
    ('Devilry admin', 'admin@example.com'),
    )
MANAGERS = ADMINS
MEDIA_ROOT = join(this_dir, "filestore")
ROOT_URLCONF = 'trix.urls'

DEVILRY_SEND_EMAIL_TO_USERS = False
EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
EMAIL_FILE_PATH = join(this_dir, 'email_log')
DEVILRY_EMAIL_DEFAULT_FROM = 'devilry-support@example.com'
DEVILRY_SYSTEM_ADMIN_EMAIL='devilry-support@example.com'

DEVILRY_DELIVERY_STORE_BACKEND = 'devilry.apps.core.deliverystore.FsDeliveryStore'
DELIVERY_STORE_ROOT = join(this_dir, 'deliverystore')

DEVILRY_HELP_URL = 'https://www.uio.no/studier/emner/matnat/ifi/INF1000/h12/trix/bruksanvisning.html'

MIDDLEWARE_CLASSES = MIDDLEWARE_CLASSES + [
    'trix.logexceptionsmiddleware.TracebackLoggingMiddleware',
    #'devilry.utils.profile.ProfilerMiddleware' # Enable profiling. Just add ?prof=yes to any url to see a profile report
    ]


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
#        'default': {
#            'level':'DEBUG',
#            'class':'logging.handlers.RotatingFileHandler',
#            'filename': 'logs/mylog.log',
#            'maxBytes': 1024*1024*5, # 5 MB
#            'backupCount': 5
#        },  
        'console': {
            'level':'DEBUG',
            'class':'logging.StreamHandler'
            }
        },
    'loggers': {
#        'trix.logexceptionsmiddleware': {
#            'handlers': ['default'],
#            'level': 'DEBUG'
#            },
#        'sauce': {
#            'handlers': ['default'],
#            'level': 'DEBUG'
#            }
        }
    }
