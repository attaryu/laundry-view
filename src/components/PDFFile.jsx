import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  table: {
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #EEE',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    fontSize: '7px',
  },
  header: {
    borderTop: 'none',
    backgroundColor: '#dcdcdc',
  },
  bold: {
    fontWeight: 'bold',
  },

  row1: {
    width: '27%',
  },
  row2: {
    width: '15%',
  },
  row3: {
    width: '10%',
  },
  row4: {
    width: '10%',
  },
  row5: {
    width: '7%',
  },
  row6: {
    width: '7%',
  },
  row7: {
    width: '10%',
  },
  row8: {
    width: '10%',
  },
  title: {
    fontSize: '15px',
    fontWeight: 'extrabold',
    padding: 10,
  },
  date: {
    fontSize: '10px',
    fontWeight: 'extrabold',
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
});

export default function PDFFile({ data, query }) {
  return (
    <Document>
      <Page>
        <View>
          {query.target === 'all' ? (
            <Text style={styles.title}>Laporan Transaksi Semua Outlet</Text>
          ) : (
            <Text style={styles.title}>
              Laporan Transaksi Outlet
              {' '}
              {data[0].tb_outlet.nama}
            </Text>
          )}
          <Text style={styles.date}>
            {query.dateFrom}
            {' - '}
            {query.dateUntil}
          </Text>
        </View>
        <View style={styles.table}>
          <View style={[styles.row, styles.bold, styles.header]}>
            <Text style={styles.row1}>Kode Invoice</Text>
            <Text style={styles.row2}>Pelanggan</Text>
            <Text style={styles.row3}>Outlet</Text>
            <Text style={styles.row4}>Paket</Text>
            <Text style={styles.row5}>Diskon</Text>
            <Text style={styles.row6}>Total</Text>
            <Text style={styles.row7}>Lunas</Text>
            <Text style={styles.row8}>Tanggal</Text>
          </View>
          {data.map((transaksi) => (
            <View key={transaksi.kode_invoice} style={styles.row} wrap={false}>
              <Text style={styles.row1}>{transaksi.kode_invoice}</Text>
              <Text style={styles.row2}>{transaksi.tb_pelanggan.nama}</Text>
              <Text style={styles.row3}>{transaksi.tb_outlet.nama}</Text>
              <Text style={styles.row4}>{transaksi.tb_paket.nama_paket}</Text>
              <Text style={styles.row5}>
                {transaksi.diskon}
                %
              </Text>
              <Text style={styles.row6}>{transaksi.total}</Text>
              <Text style={styles.row7}>
                {transaksi.lunas ? 'Lunas' : 'Belum Lunas'}
              </Text>
              <Text style={styles.row8}>{transaksi.tanggal}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

PDFFile.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  query: PropTypes.object.isRequired,
};
