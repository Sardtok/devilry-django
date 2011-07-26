from devilry_settings import *

DEBUG = False
TEMPLATE_DEBUG = DEBUG

TIME_ZONE = 'Europe/Oslo'
LANGUAGE_CODE = 'en-us'
SITE_ID = 1
USE_I18N = True
DATETIME_FORMAT = "N j, Y, H:i"
LOGIN_URL = '/authenticate/login'
STATIC_URL = '/static/'

INSTALLED_APPS = ['django.contrib.markup',
                  'django.contrib.sessions',
                  'django.contrib.sites',
                  'django.contrib.auth',
                  'django.contrib.contenttypes',
                  'django.contrib.staticfiles',
                  'django.contrib.sessions',

                  'devilry.apps.core',
                  'devilry.apps.theme',
                  'devilry.apps.extjshelpers',
                  #'devilry.apps.approved_gradeeditor',

                  'devilry.apps.student',
                  'devilry.apps.examiner',
                  'devilry.apps.administrator',
                  'devilry.apps.authenticate',
                  'devilry.apps.gradeeditors']

TEMPLATE_CONTEXT_PROCESSORS = ("django.contrib.auth.context_processors.auth",
                               "django.core.context_processors.debug",
                               "django.core.context_processors.i18n",
                               "django.core.context_processors.media",
                               "django.core.context_processors.debug",
                               'devilry.apps.theme.templatecontext.template_variables')


MIDDLEWARE_CLASSES = ['django.middleware.common.CommonMiddleware',
                      'django.contrib.sessions.middleware.SessionMiddleware',
                      'django.contrib.auth.middleware.AuthenticationMiddleware',
                      'django.middleware.transaction.TransactionMiddleware']
