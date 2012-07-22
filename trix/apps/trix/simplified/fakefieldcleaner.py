from django.core.exceptions import ValidationError

def fakefieldcleaner(original_class):
    """
    Class decorator to add general support for adding stuff to ManyToManyFields
    using fake_editablefields.

    This requires that you add a fake_real_map to the simplified class's Meta class.
    The fake_real_map is a dictionary with keys matching the fake_editablefields,
    and tuple values containing at least the name of the real field
    and the class of the model the field relates to,
    in addition the name of the lookup field in the related class may be added.

    You may add two lookup fields for the related class. If you add only one,
    then either only single values or multiple values will be supported unless
    they use the same lookup field.
    """

    original_post_save = original_class.post_save

    @classmethod
    def post_save(cls, user, obj):
        if not hasattr(cls._meta, 'fake_real_map'):
            return original_post_save(user, obj)

        for fake_field in cls._meta.fake_editablefields:
            fake_val = getattr(obj, fake_field, None)
            if fake_val is None or fake_field not in cls._meta.fake_real_map:
                continue

            real = cls._meta.fake_real_map[fake_field]
            manager = getattr(obj, real[0])
            
            # Single object to add
            if isinstance(fake_val, int):
                foreign_field = 'pk'
                if len(real) >= 3:
                    foreign_field = real[2]
                try:
                    x = real[1].objects.get(**{foreign_field: abs(fake_val)})
                except real[1].DoesNotExist:
                    continue
                
                if fake_val > 0:
                    manager.add(x)

                    # Note that we cannot be sure that adding x is safe
                    # Raising an exception here breaks the restful protocol currently
                    # fakefieldcleaner should probably add a custom version of EditForm
                    # that handles the fake fields and raises FieldErrors
                    try:
                        x.full_clean()
                    except ValidationError:
                        manager.remove(x)
                        continue
                else:
                    manager.remove(x)
                    
            # Add multiple objects
            elif isinstance(fake_val, list) and len(real) >= 3:
                foreign_field = real[-1] + '__in'
                manager.clear()
                for x in real[1].objects.filter(**{foreign_field: fake_val}):
                    manager.add(x)
                    try:
                        x.full_clean()
                    except ValidationError:
                        manager.remove(x)
                        continue
            
        return original_post_save(user, obj)
        
    original_class.post_save = post_save
    return original_class
