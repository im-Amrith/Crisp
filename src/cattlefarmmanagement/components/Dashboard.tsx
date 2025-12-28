import { useState, useEffect } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { Plus, TrendingUp, TrendingDown, Equal, FileSpreadsheet, FileText, PawPrint, BellRing } from 'lucide-react'; // Added BellRing for alerts
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Link from 'next/link';
// Assuming these paths are correct relative to where Dashboard.tsx is located
import { DataService } from '../lib/dataService';
import { CowService } from '../lib/cowService';
import type { MilkRecord, Cow, HealthRecord } from '../types';

const Dashboard = () => {
  const [todayStats, setTodayStats] = useState<MilkRecord | null>(null);
  const [yesterdayStats, setYesterdayStats] = useState<MilkRecord | null>(null);
  const [weeklyData, setWeeklyData] = useState<{ date: string; total: number }[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [monthlyRecordCount, setMonthlyRecordCount] = useState(0);
  const [monthlyRecords, setMonthlyRecords] = useState<MilkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousMonthData, setPreviousMonthData] = useState<{
    month: string;
    records: MilkRecord[];
  } | null>(null);
  const [cowStats, setCowStats] = useState({
    total: 0,
    adults: 0,
    calves: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentDate = new Date();
        const currentMonth = format(currentDate, 'yyyy-MM');
        const dayOfMonth = parseInt(format(currentDate, 'dd'));

        // Check if we're in first 5 days of the month
        if (dayOfMonth <= 5) {
          const previousMonth = format(subMonths(currentDate, 1), 'yyyy-MM');
          const previousRecords = await DataService.getMonthlyRecords(previousMonth);

          if (previousRecords.length > 0) {
            setPreviousMonthData({
              month: previousMonth,
              records: previousRecords
            });

            // Archive previous month's data - this usually happens once per month
            // Consider moving this to a server-side function or a dedicated job
            // for more robust execution.
            await DataService.checkAndArchiveOldMonth();
          }
        }

        // Fetch current month records
        const records = await DataService.getMonthlyRecords(currentMonth);

        // Sort records by date (most recent first)
        const sortedRecords = records.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setMonthlyRecords(sortedRecords);

        const todayDate = format(new Date(), 'yyyy-MM-dd');
        const yesterdayDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');

        // Find today's and yesterday's records
        const todayRecord = sortedRecords.find(record => record.date === todayDate);
        const yesterdayRecord = sortedRecords.find(record => record.date === yesterdayDate);

        setTodayStats(todayRecord || null);
        setYesterdayStats(yesterdayRecord || null);

        // Calculate monthly total with null check
        if (sortedRecords.length > 0) {
          const total = sortedRecords.reduce((sum, record) => sum + record.total_milk, 0);
          setMonthlyTotal(total);
          setMonthlyRecordCount(sortedRecords.length);

          // Get last 7 days data
          const last7Days = sortedRecords
            .slice(0, 7)
            .map(record => ({
              date: format(new Date(record.date), 'MMM dd'),
              total: record.total_milk
            }))
            .reverse(); // Reverse to show chronologically (oldest first)

          setWeeklyData(last7Days);
        } else {
          setMonthlyTotal(0);
          setMonthlyRecordCount(0);
          setWeeklyData([]);
        }

        // Add cow statistics fetch
        const cows = await CowService.getCows({ status: 'Active' });
        const stats = calculateCowStats(cows);
        setCowStats(stats);

      } catch (error) {
        console.error('Error fetching data:', error);
        // Reset states on error
        setMonthlyRecords([]);
        setMonthlyTotal(0);
        setMonthlyRecordCount(0);
        setWeeklyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run once on component mount

  const calculateCowStats = (cows: Cow[]) => {
    const adults = cows.filter(cow => cow.age_category === 'Adult').length;
    const calves = cows.filter(cow => cow.age_category === 'Calf').length;
    return {
      total: cows.length,
      adults,
      calves
    };
  };

  const getProductionTrend = () => {
    if (!todayStats || !yesterdayStats) return null;

    const diff = todayStats.total_milk - yesterdayStats.total_milk;
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-600', text: `+${diff.toFixed(1)}L` }; // Stronger green
    if (diff < 0) return { icon: TrendingDown, color: 'text-red-600', text: `${diff.toFixed(1)}L` }; // Stronger red
    return { icon: Equal, color: 'text-gray-900', text: 'No change' }; // Gray for neutral
  };

  const trend = getProductionTrend();

  const handleExportExcel = async (month: string, records: MilkRecord[]) => {
    try {
      const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(
        records.map(record => ({
          Date: format(new Date(record.date), 'dd MMM yyyy'),
          'Morning (L)': record.morning_milk,
          'Evening (L)': record.evening_milk,
          'Total (L)': record.total_milk
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Milk Records');
      XLSX.writeFile(workbook, `milk-records-${month}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const handleExportPDF = async (month: string, records: MilkRecord[]) => {
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();

      autoTable(doc, {
        head: [['Date', 'Morning (L)', 'Evening (L)', 'Total (L)']],
        body: records.map(record => [
          format(new Date(record.date), 'dd MMM yyyy'),
          record.morning_milk.toString(),
          record.evening_milk.toString(),
          record.total_milk.toString()
        ]),
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] } // Green-500 equivalent for PDF header
      });

      doc.save(`milk-records-${month}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div> {/* Green spinner */}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen"> {/* Lighter background */}
      <h1 className="text-3xl font-extrabold text-gray-900">Farm Overview</h1> {/* Stronger title */}

      {/* Alerts Section - now with BellRing icon and green theme */}
      <div className="grid grid-cols-1 gap-6">
        <AlertsSection />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Herd Statistics Card */}
        <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col justify-between border-2 border-green-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-black flex items-center">
              <PawPrint className="h-7 w-7 mr-2 text-green-700" />
              Our Herd
            </h2>
            <Link
              href="/cattlefarmmanagement/cows"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-green-700 hover:bg-green-800 transition-all shadow-lg hover:scale-105"
            >
              <PawPrint className="h-4 w-4 mr-2" />
              Manage Animals
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200 shadow-inner">
              <p className="text-4xl font-black text-green-800">
                {cowStats.total}
              </p>
              <p className="text-sm font-bold text-black uppercase tracking-wider">Total</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200 shadow-inner">
              <p className="text-4xl font-black text-blue-800">
                {cowStats.adults}
              </p>
              <p className="text-sm font-bold text-black uppercase tracking-wider">Adults</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl border-2 border-orange-200 shadow-inner">
              <p className="text-4xl font-black text-orange-800">
                {cowStats.calves}
              </p>
              <p className="text-sm font-bold text-black uppercase tracking-wider">Calves</p>
            </div>
          </div>
        </div>

        {/* Today's Production Card */}
        <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col justify-between border-2 border-blue-100">
          <h2 className="text-2xl font-bold mb-4 text-black">Today's Production</h2>
          {todayStats ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-blue-600 p-4 rounded-xl shadow-lg">
                <span className="text-xl text-white font-bold">Total Yield</span>
                <span className="text-4xl font-black text-white">
                  {todayStats.total_milk.toFixed(1)} L
                </span>
              </div>
              {trend && (
                <div className="flex items-center text-lg justify-center mt-3 p-3 bg-gray-100 rounded-xl border border-gray-200">
                  <trend.icon className={`h-6 w-6 mr-2 ${trend.color}`} />
                  <span className={`${trend.color} font-black`}>{trend.text}</span>
                  <span className="text-black font-bold ml-1"> from yesterday</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="text-sm font-bold text-black uppercase">Morning</div>
                  <div className="font-black text-2xl text-blue-700">{todayStats.morning_milk.toFixed(1)} L</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="text-sm font-bold text-black uppercase">Evening</div>
                  <div className="font-black text-2xl text-blue-700">{todayStats.evening_milk.toFixed(1)} L</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-black font-bold mb-6 text-xl">No milk record for today.</p>
              <Link
                href="/cattlefarmmanagement/data-entry"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-black rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl hover:scale-105"
              >
                <Plus className="h-6 w-6 mr-3" />
                Add Record
              </Link>
            </div>
          )}
        </div>

        {/* Monthly Overview Card */}
        <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col justify-between border-2 border-purple-100">
          <h2 className="text-2xl font-bold mb-4 text-black">Monthly Performance</h2>
          <div className="space-y-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
              <span className="text-5xl font-black text-purple-700">
                {monthlyTotal.toFixed(1)} L
              </span>
              <p className="text-lg font-bold text-black mt-1">Total Production</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200 text-center shadow-sm">
              <div className="text-sm font-bold text-black uppercase">Daily Average</div>
              <div className="font-black text-3xl text-green-700">
                {monthlyRecordCount > 0 ? (monthlyTotal / monthlyRecordCount).toFixed(1) : '0.0'} L
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div className="text-sm font-bold text-black uppercase">Avg Morning</div>
                <div className="font-black text-xl text-purple-700">
                  {monthlyRecordCount > 0
                    ? (monthlyRecords.reduce((sum, r) => sum + r.morning_milk, 0) / monthlyRecordCount).toFixed(1)
                    : '0.0'} L
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div className="text-sm font-bold text-black uppercase">Avg Evening</div>
                <div className="font-black text-xl text-purple-700">
                  {monthlyRecordCount > 0
                    ? (monthlyRecords.reduce((sum, r) => sum + r.evening_milk, 0) / monthlyRecordCount).toFixed(1)
                    : '0.0'} L
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Trend Card */}
      <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-black border-b-4 border-green-500 pb-2 inline-block">Weekly Production Trend</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {weeklyData.length > 0 ? (
            weeklyData.map((day) => (
              <div key={day.date} className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-green-400 transition-all hover:shadow-lg">
                <span className="text-black font-black text-lg mb-2">{day.date}</span>
                <span className="font-black text-3xl text-green-700">{day.total.toFixed(1)} L</span>
              </div>
            ))
          ) : (
            <p className="text-black font-bold text-center py-8 col-span-full text-xl">No weekly data available.</p>
          )}
        </div>
      </div>

      {/* Previous Month Export Section */}
      {previousMonthData && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 md:mb-0">
              Export Records for {format(new Date(previousMonthData.month), 'MMMM yyyy')}
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleExportExcel(previousMonthData.month, previousMonthData.records)}
                className="inline-flex items-center px-5 py-2.5 border border-green-300 shadow-sm text-sm font-medium rounded-lg text-green-800 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as Excel
              </button>
              <button
                onClick={() => handleExportPDF(previousMonthData.month, previousMonthData.records)}
                className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AlertsSection = () => {
  const [alerts, setAlerts] = useState<{
    calvingAlerts: Array<{ cow: Cow, date: string }>;
    followupAlerts: Array<{ cow: Cow, record: HealthRecord, date: string }>;
  }>({ calvingAlerts: [], followupAlerts: [] });
  const [loadingAlerts, setLoadingAlerts] = useState(true); // New loading state for alerts

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoadingAlerts(true);
      const alertData = await CowService.getUpcomingAlerts();
      setAlerts(alertData);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoadingAlerts(false);
    }
  };

  if (loadingAlerts) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (alerts.calvingAlerts.length === 0 && alerts.followupAlerts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 text-center text-black border-2 border-green-100">
        <p className="font-black text-xl">No upcoming alerts at this time. All clear! ✅</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-red-100">
      <h2 className="text-3xl font-black mb-8 text-black flex items-center border-b-4 border-red-500 pb-2 inline-block">
        <BellRing className="h-8 w-8 mr-3 text-red-600 animate-pulse" />
        Important Alerts
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {alerts.calvingAlerts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-red-800 uppercase tracking-widest border-b-2 border-red-200 pb-2">
              Upcoming Calvings
            </h3>
            {alerts.calvingAlerts.map(({ cow, date }) => (
              <div
                key={cow.id}
                className="flex items-center justify-between p-5 bg-red-50 rounded-2xl shadow-md border-2 border-red-200 hover:bg-red-100 transition-all"
              >
                <div>
                  <Link
                    href={`/cattlefarmmanagement/cows/${cow.id}`}
                    className="text-red-800 font-black hover:underline text-2xl"
                  >
                    Tag: {cow.tag_number}
                  </Link>
                  <p className="text-black font-bold mt-1">
                    Expected calving date
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-black">
                    {format(new Date(date), 'dd MMM yyyy')}
                  </div>
                  <div className="text-sm font-bold text-red-600 mt-1 bg-white px-2 py-1 rounded-full shadow-sm inline-block">
                    {formatDistanceToNow(new Date(date), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {alerts.followupAlerts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-orange-800 uppercase tracking-widest border-b-2 border-orange-200 pb-2">
              Health Follow-ups
            </h3>
            {alerts.followupAlerts.map(({ cow, record, date }) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-5 bg-orange-50 rounded-2xl shadow-md border-2 border-orange-200 hover:bg-orange-100 transition-all"
              >
                <div>
                  <Link
                    href={`/cattlefarmmanagement/cows/${cow.id}`}
                    className="text-orange-800 font-black hover:underline text-2xl"
                  >
                    Tag: {cow.tag_number}
                  </Link>
                  <p className="text-black font-bold mt-1">
                    <span className="font-black text-orange-700">{record.record_type}</span> follow-up
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-black">
                    {format(new Date(date), 'dd MMM yyyy')}
                  </div>
                  <div className="text-sm font-bold text-orange-600 mt-1 bg-white px-2 py-1 rounded-full shadow-sm inline-block">
                    {formatDistanceToNow(new Date(date), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
