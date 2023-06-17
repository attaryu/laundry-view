import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import DropDownFilter from './DropDownFilter';
import OperatorSwitcher from './OperatorSwitcher';

import PopUpContext from '@/contexts/popUp';

import {
  addFilter,
  addSubFilter,
  changeOperator,
  changeSpecificAttributeFilter,
  changeSpecificEqualsFilter,
  changeSpecificValueFilter,
  changeSpecificValueTypeFilter,
  clearAllFilter,
  deleteSpecificFilter,
  changeSubOperator,
  changeSubSpecificAttributeFilter,
  changeSubSpecificEqualsFilter,
  changeSubSpecificValueFilter,
  changeSubSpecificValueTypeFilter,
  deleteSubSpecificFilter,
  addFilterToSubFilter,
} from '@/stores/filter/filter';

export default function FilterGroup({ refetch }) {
  const dispatch = useDispatch();
  const { setPopUp } = useContext(PopUpContext);
  const filter = useSelector((state) => state.filter);

  function submitFilter() {
    const body = {
      operator: filter.operator,
      filter: filter.filter.filter((fltr) => {
        if (fltr.type === 'FILTER' && (fltr.attribute !== null && fltr.value !== null)) {
          return fltr;
        }

        if (fltr.type === 'SUB_FILTER') {
          const filtered = fltr
            .filter
            .filter((sub) => sub.value !== null && sub.attribute !== null);

          if (filtered.length === 0) {
            return null;
          }

          return {
            ...fltr,
            filter: filtered,
          };
        }

        return null;
      }).map((fltr) => {
        if (fltr.type === 'FILTER') {
          let { value } = fltr;

          if (fltr.value === 'true' || fltr.value === 'false') {
            value = value === 'true';
          }

          return {
            type: fltr.type,
            attribute: fltr.attribute,
            equals: fltr.equals,
            value,
          };
        }

        return {
          type: fltr.type,
          operator: fltr.operator,
          filter: fltr.filter.map((f) => {
            let { value } = f;

            if (f.value === 'true' || f.value === 'false') {
              value = value === 'true';
            }

            return {
              attribute: f.attribute,
              equals: f.equals,
              value,
            };
          }),
        };
      }),
    };

    refetch(body);
    setPopUp(false);
  }

  return (
    <div className="w-[700px]">
      <div className="mt-3 w-full flex flex-col gap-3">
        {filter.filter.map((fltr, i) => (
          <Item key={fltr.id} filter={fltr} order={i + 1} filterState={filter} />
        ))}
      </div>

      <div className="flex gap-4 mt-5">
        <button
          type="button"
          className="bg-amber-300 px-2 py-1 rounded-md mt-4 flex items-center gap-1"
          onClick={() => dispatch(addFilter())}
        >
          <AddIcon sx={{ fontSize: 17 }} />
          Filter
        </button>

        <button
          type="button"
          className="bg-amber-200 px-2 py-1 rounded-md mt-4 flex items-center gap-1"
          onClick={() => dispatch(addSubFilter())}
        >
          <AddIcon sx={{ fontSize: 17 }} />
          Sub Filter
        </button>

        <button
          type="button"
          className="bg-red-400 px-2 py-1 rounded-md mt-4 flex items-center gap-1"
          onClick={() => dispatch(clearAllFilter())}
        >
          Clear All
        </button>

        <button
          type="submit"
          className="bg-amber-400 px-2 py-1 ml-auto rounded-md mt-4 flex items-center gap-1"
          onClick={submitFilter}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

FilterGroup.propTypes = {
  refetch: PropTypes.func.isRequired,
};

function Item({ filter, order, filterState }) {
  const dispatch = useDispatch();

  const attributeOption = filterState.attribute.map(({ title, value }) => ({ name: title, value }));
  const thisAttribute = filterState.attribute.find((atr) => atr.value === filter.attribute);

  function changesHandler(e, prop, action, reference, type, subId) {
    let { value } = e.target;

    if (type && reference.valueType === 'min') {
      value = { min: new Date(value).toISOString() };
    } else if (type && reference.valueType === 'max') {
      value = { max: new Date(value).toISOString() };
    } else if (type && reference.valueType === 'range') {
      value = { ...reference.value, [type]: new Date(value).toISOString() };
    } else {
      value = Number.isNaN(parseInt(value, 10)) || value.length !== 10
        ? value
        : new Date(value).toISOString();
    }

    if (filter.type === 'FILTER') {
      dispatch(action({ id: filter.id, [prop]: value }));
    } else {
      dispatch(action({ id: filter.id, subId, [prop]: value }));
    }
  }

  if (filter.type === 'FILTER') {
    return (
      <div className="w-full flex gap-3">
        <div className="w-16 grid place-items-center">
          <OperatorSwitcher
            order={order}
            operator={filterState.operator}
            event={(e) => dispatch(changeOperator(e.target.value))}
          />
        </div>
        <div className="w-full grid grid-col-6 grid-flow-col gap-2">
          {/* attribute option */}
          <div className="col-span-1">
            <DropDownFilter
              title="Attribute"
              options={attributeOption}
              eventChanges={(e) => changesHandler(e, 'attribute', changeSpecificAttributeFilter, filter)}
              defaultValue={filter.attribute}
              operator={filterState.operator}
            />
          </div>

          {/* equals option */}
          <div>
            <DropDownFilter
              title="Equals"
              options={[
                { name: 'Is', value: 'IS' },
                { name: 'Is not', value: 'IS_NOT' },
              ]}
              eventChanges={(e) => changesHandler(e, 'equals', changeSpecificEqualsFilter, filter)}
              defaultValue={filter.equals}
              disable={thisAttribute?.option?.length <= 2 || false}
            />
          </div>

          {/* type option for date or number */}
          {thisAttribute?.type === 'date' || thisAttribute?.type === 'number' ? (
            <div className="col-span-3">
              <DropDownFilter
                title="Type"
                options={[
                  { name: 'Equal', value: 'equal' },
                  { name: 'Min', value: 'min' },
                  { name: 'Max', value: 'max' },
                  { name: 'Range', value: 'range' },
                ]}
                eventChanges={(e) => changesHandler(e, 'valueType', changeSpecificValueTypeFilter, filter)}
                defaultValue={filter.valueType || thisAttribute.type}
              />
            </div>
          ) : null}

          {/* value option when type is not date or number */}
          {thisAttribute?.type === 'option' ? (
            <div className="col-span-3">
              <DropDownFilter
                title="Value"
                options={thisAttribute.option}
                eventChanges={(e) => changesHandler(e, 'value', changeSpecificValueFilter, filter)}
                defaultValue={filter.value}
              />
            </div>
          ) : null}

          {/* value for date and number */}
          {thisAttribute?.type && thisAttribute?.type !== 'option' && (
            <div className="col-span-3 flex gap-2">
              {filter.valueType === 'equal' && (
                <input
                  type={thisAttribute?.type}
                  className="bg-zinc-100 px-1 w-full h-full border-[1px] border-zinc-400 rounded-md"
                  placeholder="Value"
                  onChange={(e) => changesHandler(e, 'value', changeSpecificValueFilter, filter)}
                  value={filter.value?.split('T')[0] ?? ''}
                />
              )}
              {(filter.valueType === 'min' || filter.valueType === 'range') && (
                <input
                  type={thisAttribute?.type}
                  className="bg-zinc-100 px-1 w-full h-full border-[1px] border-zinc-400 rounded-md"
                  placeholder="Min"
                  onChange={(e) => changesHandler(e, 'value', changeSpecificValueFilter, filter, 'min')}
                  value={filter.value?.min?.split('T')[0] ?? ''}
                />
              )}
              {(filter.valueType === 'max' || filter.valueType === 'range') && (
                <input
                  type={thisAttribute?.type}
                  className="bg-zinc-100 px-1 w-full h-full border-[1px] border-zinc-400 rounded-md"
                  placeholder="Max"
                  onChange={(e) => changesHandler(e, 'value', changeSpecificValueFilter, filter, 'max')}
                  value={filter.value?.max?.split('T')[0] ?? ''}
                />
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          className="border-[1px] border-red-300 bg-red-100 rounded-md h-auto px-1"
          onClick={() => dispatch(deleteSpecificFilter(filter.id))}
        >
          <DeleteOutlineOutlinedIcon className="text-red-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-3">
      <div className="w-16 grid place-items-start">
        <OperatorSwitcher
          order={order}
          operator={filterState.operator}
          event={(e) => dispatch(changeOperator(e.target.value))}
        />
      </div>

      {/* sub filter */}
      <div className="w-full rounded-md p-1.5 border-[1px] border-zinc-300">
        {filter.filter.map((fltr, subOrder) => {
          const thisSubAttribute = filterState
            .attribute
            .find((atr) => atr.value === fltr.attribute);

          return (
            <div key={Math.random()} className="w-full flex gap-3 my-2.5">
              <div className="w-16">
                <OperatorSwitcher
                  order={subOrder + 1}
                  operator={filter.operator}
                  event={(e) => dispatch(changeSubOperator({
                    id: filter.id,
                    operator: e.target.value,
                  }))}
                />
              </div>

              <div className="w-full grid grid-col-6 grid-flow-col gap-2">
                {/* attribute option */}
                <div className="col-span-1">
                  <DropDownFilter
                    title="Attribute"
                    options={attributeOption}
                    eventChanges={(e) => changesHandler(e, 'attribute', changeSubSpecificAttributeFilter, fltr, false, fltr.id)}
                    defaultValue={fltr.attribute}
                    operator={filterState.operator}
                  />
                </div>

                {/* equals option */}
                <div>
                  <DropDownFilter
                    title="Equals"
                    options={[
                      { name: 'Is', value: 'IS' },
                      { name: 'Is not', value: 'IS_NOT' },
                    ]}
                    eventChanges={(e) => changesHandler(e, 'equals', changeSubSpecificEqualsFilter, fltr, false, fltr.id)}
                    defaultValue={fltr.equals}
                    disable={thisSubAttribute?.option?.length <= 2 || false}
                  />
                </div>

                {/* type option for date or number */}
                {thisSubAttribute?.type === 'date' || thisSubAttribute?.type === 'number' ? (
                  <div className="col-span-3">
                    <DropDownFilter
                      title="Type"
                      options={[
                        { name: 'Equal', value: 'equal' },
                        { name: 'Min', value: 'min' },
                        { name: 'Max', value: 'max' },
                        { name: 'Range', value: 'range' },
                      ]}
                      eventChanges={(e) => changesHandler(e, 'valueType', changeSubSpecificValueTypeFilter, fltr, false, fltr.id)}
                      defaultValue={fltr.valueType || thisSubAttribute.type}
                    />
                  </div>
                ) : null}

                {/* value option when type is not date or number */}
                {thisSubAttribute?.type === 'option' ? (
                  <div className="col-span-3">
                    <DropDownFilter
                      title="Value"
                      options={thisSubAttribute.option}
                      eventChanges={(e) => changesHandler(e, 'value', changeSubSpecificValueFilter, fltr, false, fltr.id)}
                      defaultValue={fltr.value}
                    />
                  </div>
                ) : null}

                {/* value for date and number */}
                {thisSubAttribute?.type && thisSubAttribute?.type !== 'option' && (
                  <div className="col-span-3 flex gap-2">
                    {fltr.valueType === 'equal' && (
                      <input
                        type={thisSubAttribute?.type}
                        className="bg-zinc-100 px-1 w-full h-full border-[1px] border-zinc-400 rounded-md"
                        placeholder="Value"
                        onChange={(e) => changesHandler(e, 'value', changeSubSpecificValueFilter, fltr, false, fltr.id)}
                        value={fltr.value?.split('T')[0] ?? ''}
                      />
                    )}
                    {(fltr.valueType === 'min' || fltr.valueType === 'range') && (
                      <input
                        type={thisSubAttribute?.type}
                        className="bg-zinc-100 px-1 w-full h-full border-[1px] border-zinc-400 rounded-md"
                        placeholder="Min"
                        onChange={(e) => changesHandler(e, 'value', changeSubSpecificValueFilter, fltr, 'min', fltr.id)}
                        value={fltr.value?.min?.split('T')[0] ?? ''}
                      />
                    )}
                    {(fltr.valueType === 'max' || fltr.valueType === 'range') && (
                      <input
                        type={thisSubAttribute?.type}
                        className="bg-zinc-100 px-1 w-full h-full border-[1px] border-zinc-400 rounded-md"
                        placeholder="Max"
                        onChange={(e) => changesHandler(e, 'value', changeSubSpecificValueFilter, fltr, 'max', fltr.id)}
                        value={fltr.value?.max?.split('T')[0] ?? ''}
                      />
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="border-[1px] border-red-300 bg-red-100 rounded-md h-auto px-1"
                onClick={() => dispatch(deleteSubSpecificFilter({ id: filter.id, subId: fltr.id }))}
              >
                <DeleteOutlineOutlinedIcon className="text-red-400" />
              </button>
            </div>
          );
        })}
        <div className="flex gap-3">
          <button
            type="button"
            className="bg-amber-300 px-2 py-1 rounded-md mt-4 flex items-center gap-1"
            onClick={() => dispatch(addFilterToSubFilter(filter.id))}
          >
            <AddIcon sx={{ fontSize: 17 }} />
            Filter
          </button>
          <button
            type="button"
            className="bg-red-400 px-2 py-1 rounded-md mt-4 flex items-center gap-1"
            onClick={() => dispatch(deleteSpecificFilter(filter.id))}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

Item.propTypes = {
  filter: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.oneOf(['FILTER', 'SUB_FILTER']),

    valueType: PropTypes.string,
    attribute: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.shape({
        min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      PropTypes.string,
      PropTypes.bool,
    ]),
    equals: PropTypes.oneOf(['IS', 'IS_NOT']),

    operator: PropTypes.oneOf([null, 'AND', 'OR']),
    filter: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      valueType: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.shape({
          min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
        PropTypes.string,
        PropTypes.bool,
      ]),
      equals: PropTypes.oneOf(['IS', 'IS_NOT']),
    })),
  }).isRequired,
  order: PropTypes.number.isRequired,
  filterState: PropTypes.any.isRequired,
};
