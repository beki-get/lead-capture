import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export function exportToCSV(leads) {
  if (!leads || leads.length === 0) {
    alert('No leads to export!');
    return;
  }

  const csv = Papa.unparse(
    leads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Message: lead.message,
      Date: new Date(lead.createdAt).toLocaleString(),
    }))
  );

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `leads_${new Date().toISOString().split('T')[0]}.csv`);
}
