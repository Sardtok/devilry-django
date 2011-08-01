from devilry.simplified import SimplifiedModelApi

class AuthorizationMixin(SimplifiedModelApi):

    @classmethod
    def read_authorize(cls, user, obj):
        return True

    @classmethod
    def write_authorize(cls, user, obj):
        return user.is_superuser()
