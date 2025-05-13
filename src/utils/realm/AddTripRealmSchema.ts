export const travelSchema = {
    name: 'Place',
    properties: {
      _id: 'int',
      placeName: 'string',
      experience: 'string',
      travelWith: 'string',
      travelBy : 'string',
      userId: 'string'
    },
    primaryKey: '_id',
  };