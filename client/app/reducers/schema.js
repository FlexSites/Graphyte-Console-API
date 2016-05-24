
export default function (state = { loading: false, errors: [], list: [] }, action) {
  switch (action.type) {
    case 'SCHEMA_LIST_SUCCESS':
      return {
        selected: action.payload[0].id,
        list: action.payload,
        loading: false,
      }
    case 'SCHEMA_LIST_PENDING':
      return {
        loading: true,
      };
    case 'SCHEMA_ITEM_ADD':
      return {
        list: [...state.list, action.payload],
        item: action.payload
      }
  }

  return state
}
