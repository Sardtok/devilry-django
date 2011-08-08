from devilry.coreutils.simplified.metabases import SimplifiedPeriodMetaMixin
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi
from authorization import AuthorizationMixin

@simplified_modelapi
class SimplifiedPeriod(AuthorizationMixin):
    class Meta(SimplifiedPeriodMetaMixin):
        methods = ['read', 'search']

    
