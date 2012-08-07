from django.utils.translation import ugettext as _
from django.core.exceptions import ValidationError
from django.db import models

from periodgroup import PeriodGroup

from devilry.apps.core.models.period import Period as DevilryPeriod
from devilry.apps.core.models.custom_db_fields import ShortNameField, LongNameField

class Period(DevilryPeriod):
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
        if self.group is not None and self.group.subject_id != self.parentnode_id:
            raise ValidationError(_('Periods cannot be added to a different subject\'s groups.'))
        
        super(Period, self).clean(*args, **kwargs)
