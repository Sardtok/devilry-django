from django.utils.translation import ugettext as _
from django.core.exceptions import ValidationError
from django.db import models

from periodgroup import PeriodGroup

from devilry.apps.core.models import period
from devilry.apps.core.models.custom_db_fields import ShortNameField, LongNameField

class Period(period.Period):
    """
    A wrapper for Devilry's periods to add period grouping.
    
    .. attribute:: group
    
        The group which the period is a part of.
    """
    
    class Meta:
        app_label = 'trix'
        
    group = models.ForeignKey(PeriodGroup, related_name="periods",
                              verbose_name=_('Period Group'), blank=True, null=True)

    def clean(self, *args, **kwargs):
        """
        Ensures that the group is not added to other subjects.
        """
        print self.group
        if self.group is not None and self.group.subject is not self.parentnode:
            raise ValidationError(_('Periods cannot be added to a different subject\'s groups.'))
        
        super(Period, self).clean(*args, **kwargs)
