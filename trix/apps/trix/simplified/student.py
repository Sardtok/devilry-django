from django.contrib.auth.models import User
from trix.apps.trix.models import PeriodGroup
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi
from authorization import AuthorizationMixin
from fakefieldcleaner import fakefieldcleaner

@fakefieldcleaner
@simplified_modelapi
class SimplifiedStudent(SimplifiedModelApi):
    """ Simplified wrapper for :class:`django.contrib.auth.models.User`. """
    class Meta(object):
        model = User
        resultfields = FieldSpec('id', 'username', 'followedgroups__id')
        fake_editablefields = ('fake_followedgroups',)
        fake_real_map = {'fake_followedgroups': ('followedgroups', PeriodGroup)}
        searchfields = FieldSpec('username')
        methods = ['read', 'update']

    @classmethod
    def read_authorize(cls, user, obj):
        if not user.is_superuser or user.pk != obj.pk:
            raise PermissionDenied()

    @classmethod
    def write_authorize(cls, user, obj):
        if not user.is_superuser or user.pk != obj.pk:
            raise PermissionDenied()

    @classmethod
    def create_searchqryset(cls, user, **kwargs):
        if user.is_superuser:
            return cls._meta.model.objects.all()
        return cls._meta.model.objects.filter(pk=user.pk)
        
