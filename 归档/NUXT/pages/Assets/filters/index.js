import moment from 'moment';

const filters = {};

filters.dubaiDate = function(val, format = 'YYYY-MM-DD hh:mm:ss') {
  return (
    moment(val)
      // .utc()
      .add(4, 'h')
      .format(format)
  );
};

filters.dubaiDateStp = function(val, format = 'YYYY-MM-DD hh:mm:ss') {
  return moment(val)
    .utc()
    .add(4, 'h')
    .format(format);
};

export default {
  ...filters,
};
