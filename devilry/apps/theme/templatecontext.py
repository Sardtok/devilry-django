from django.conf import settings


def template_variables(request):
    return {'DEVILRY_STATIC_URL': settings.DEVILRY_STATIC_URL,
            'DEVILRY_MAIN_PAGE': settings.DEVILRY_MAIN_PAGE,
            'DEVILRY_LOGOUT_URL': settings.DEVILRY_LOGOUT_URL,
            'session': request.session,
            'DEVILRY_THEME_URL': settings.DEVILRY_THEME_URL,
            'DEVILRY_EXTJS_URL': settings.DEVILRY_EXTJS_URL,
            'DEVILRY_SYNCSYSTEM': settings.DEVILRY_SYNCSYSTEM}
