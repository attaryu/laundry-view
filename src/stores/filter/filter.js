import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  operator: null,
  attribute: [],
  filter: [],
};

const filterGroup = createSlice({
  initialState,
  name: 'filter',
  reducers: {
    changeOperator(state, { payload }) {
      state.operator = payload;
    },
    registerFilter(state, { payload }) {
      state.attribute = payload;
    },
    addFilter(state) {
      state.filter.push({
        id: Date.now(),
        type: 'FILTER',
        attribute: null,
        valueType: null,
        value: null,
        equals: 'IS',
      });

      if (state.filter.length === 2) {
        state.operator = 'AND';
      }
    },
    addSubFilter(state) {
      state.filter.push({
        id: Date.now(),
        type: 'SUB_FILTER',
        operator: null,
        filter: [
          {
            id: Date.now(),
            attribute: null,
            valueType: null,
            value: null,
            equals: 'IS',
          },
        ],
      });

      if (state.filter.length === 2) {
        state.operator = 'AND';
      }
    },
    clearAllFilter(state) {
      state.filter = [];
      state.attribute.forEach((atr) => {
        atr.inUse = false;
      });
      state.operator = null;
    },
    changeSpecificAttributeFilter(state, { payload }) {
      const indexOfFilter = state.filter.findIndex((fltr) => fltr.id === payload.id);
      const indexOfAttribute = state.attribute.findIndex((atr) => atr.value === payload.attribute);

      state.filter[indexOfFilter].attribute = payload.attribute;
      state.attribute[indexOfAttribute].inUse = true;
      state.filter[indexOfFilter].value = null;

      if (
        state.attribute[indexOfAttribute].type === 'date'
        || state.attribute[indexOfAttribute].type === 'number'
      ) {
        state.filter[indexOfFilter].valueType = 'equal';
      }
    },
    changeSpecificEqualsFilter(state, { payload }) {
      const index = state.filter.findIndex(({ id }) => id === payload.id);
      state.filter[index].equals = payload.equals;
    },
    changeSpecificValueFilter(state, { payload }) {
      const index = state.filter.findIndex(({ id }) => id === payload.id);
      state.filter[index].value = payload.value;
    },
    changeSpecificValueTypeFilter(state, { payload }) {
      const index = state.filter.findIndex(({ id }) => id === payload.id);
      state.filter[index].valueType = payload.valueType;
    },
    deleteSpecificFilter(state, { payload }) {
      state.filter = state.filter.filter(({ id }) => id !== payload);
    },

    addFilterToSubFilter(state, { payload }) {
      const index = state.filter.findIndex(({ id }) => id === payload);
      state.filter[index].filter.push({
        id: Date.now(),
        attribute: null,
        valueType: null,
        value: null,
        equals: 'IS',
      });

      if (state.filter[index].filter.length === 2) {
        state.filter[index].operator = 'AND';
      }
    },
    changeSubOperator(state, { payload }) {
      const index = state.filter.findIndex(({ id }) => id === payload.id);
      state.filter[index].operator = payload.operator;
    },
    changeSubSpecificAttributeFilter(state, { payload }) {
      const indexOfFilter = state.filter.findIndex((fltr) => fltr.id === payload.id);
      const indexOfSubFilter = state
        .filter[indexOfFilter]
        .filter.findIndex((fltr) => fltr.id === payload.subId);
      const indexOfAttribute = state.attribute.findIndex((atr) => atr.value === payload.attribute);

      state.filter[indexOfFilter].filter[indexOfSubFilter].attribute = payload.attribute;
      state.attribute[indexOfAttribute].inUse = true;
      state.filter[indexOfFilter].filter[indexOfAttribute].value = null;

      if (
        state.attribute[indexOfAttribute].type === 'date'
        || state.attribute[indexOfAttribute].type === 'number'
      ) {
        state.filter[indexOfFilter].filter[indexOfSubFilter].valueType = 'equal';
      }
    },
    changeSubSpecificEqualsFilter(state, { payload }) {
      const index = state.filter.findIndex(({ id }) => id === payload.id);
      const indexOfSubFilter = state
        .filter[index]
        .filter.findIndex((fltr) => fltr.id === payload.subId);

      state.filter[index].filter[indexOfSubFilter].equals = payload.equals;
    },
    changeSubSpecificValueFilter(state, { payload }) {
      const index = state.filter.findIndex(({ id }) => id === payload.id);
      const indexOfSubFilter = state
        .filter[index]
        .filter.findIndex((fltr) => fltr.id === payload.subId);

      state.filter[index].filter[indexOfSubFilter].value = payload.value;
    },
    changeSubSpecificValueTypeFilter(state, { payload }) {
      const index = state.filter.findIndex(({ id }) => id === payload.id);
      const indexOfSubFilter = state
        .filter[index]
        .filter.findIndex((fltr) => fltr.id === payload.subId);

      state.filter[index].filter[indexOfSubFilter].valueType = payload.valueType;
    },
    deleteSubSpecificFilter(state, { payload }) {
      const index = state.filter.findIndex(({ id }) => id === payload.id);

      state.filter[index].filter = state
        .filter[index]
        .filter
        .filter(({ id }) => id !== payload.subId);

      if (state.filter[index].filter.length === 0) {
        state.filter = state.filter.filter(({ id }) => id !== payload.id);
      }
    },
  },
});

export const {
  registerFilter,
  addFilter,
  addSubFilter,
  clearAllFilter,
  changeOperator,
  changeSpecificAttributeFilter,
  changeSpecificEqualsFilter,
  deleteSpecificFilter,
  changeSpecificValueFilter,
  changeSpecificValueTypeFilter,
  changeSubOperator,
  changeSubSpecificAttributeFilter,
  changeSubSpecificEqualsFilter,
  changeSubSpecificValueFilter,
  changeSubSpecificValueTypeFilter,
  deleteSubSpecificFilter,
  addFilterToSubFilter,
} = filterGroup.actions;
export default filterGroup.reducer;
