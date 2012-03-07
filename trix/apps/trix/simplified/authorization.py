from devilry.simplified import SimplifiedModelApi, PermissionDenied

class AuthorizationMixin(SimplifiedModelApi):

    @classmethod
    def read_authorize(cls, user, obj):
        pass

    @classmethod
    def write_authorize(cls, user, obj):
        if not user.is_superuser:
            raise PermissionDenied()

    @classmethod
    def create_searchqryset(cls, user, **kwargs):
        return cls._meta.model.objects.all()
        
