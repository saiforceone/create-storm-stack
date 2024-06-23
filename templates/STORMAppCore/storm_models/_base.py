# author: create-storm-stack
# description: defines a base model class with default fields. The idea was to have sensible default fields
import datetime
from bson import json_util
import mongoengine as me


class StormModel(me.Document):
    """
    Abstract model implementation that allows us to have common fields defined and the
    to_json method override for all classes that inherit
    📝 Developer Note: Feel free to update the default fields as required to match your project
    """

    # default fields
    createdAt = me.DateTimeField(default=datetime.datetime.now(datetime.UTC))
    updatedAt = me.DateTimeField(default=datetime.datetime.now(datetime.UTC))

    meta = {
        # this ensures that a collection is not created for this model
        'abstract': True
    }

    def to_json(self, *args, **kwargs):
        """
        overrides the to_json method to flatten the JSON structure to make it easier for
        clients to consume and parse data sent from the API
        📝 Developer Note: Keep in mind that subclasses can override this method
        """
        data = me.Document.to_mongo(self).to_dict()
        data['_id'] = str(data['_id'])
        data['createdAt'] = data['createdAt'].isoformat()
        data['updatedAt'] = data['updatedAt'].isoformat()
        return json_util.dumps(data)
