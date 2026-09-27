import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

export const InvoiceModal = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  const milestones = project.milestones || [];
  const completedMilestones = milestones.filter((m) => m.status === 'completed');
  
  // Calculate completed sum or total budget
  const billableAmount = completedMilestones.length > 0
    ? completedMilestones.reduce((acc, m) => acc + (Number(m.amount) || 0), 0)
    : Number(project.budget) || 0;

  const taxAmount = Math.round(billableAmount * 0.10); // 10% international tax
  const totalWithTax = billableAmount + taxAmount;
  const invoiceNumber = `INV-${project._id.replace(/\D/g, '').padEnd(4, '0').slice(-4)}-2026`;
  const invoiceDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:m-0 print:w-full">
        
        {/* Modal Top Bar (Hidden during print) */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-900/90 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
              Official Tax Invoice
            </span>
            <span className="text-xs text-slate-400 font-mono">#{invoiceNumber}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / Save as PDF
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-10 space-y-8 bg-slate-900 print:bg-white print:p-4">
          
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800 print:border-gray-300">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-base">
                  CS
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white print:text-black">ClientScope Global</h2>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1.5 leading-relaxed">
                Enterprise Custom Software & Cloud Engineering<br />
                Suite 450, 100 Innovation Boulevard, Tech District, Austin, TX 78701<br />
                support@clientscope.io • Tax ID: US-EIN-94-3829104
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-3xl font-black text-emerald-400 print:text-black tracking-tight uppercase">
                INVOICE
              </span>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1 font-mono">
                Invoice No: <strong className="text-white print:text-black">{invoiceNumber}</strong><br />
                Issue Date: <strong className="text-white print:text-black">{invoiceDate}</strong><br />
                Status: <span className="text-emerald-400 font-bold uppercase">Ready for Payment</span>
              </p>
            </div>
          </div>

          {/* Billed To / Project Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-slate-400 print:text-gray-500 uppercase tracking-wider block mb-1">
                Billed To Client:
              </span>
              <h4 className="text-sm font-bold text-white print:text-black">{project.clientName}</h4>
              <p className="text-slate-300 print:text-gray-700 mt-0.5">
                Location: {project.clientCountry || 'International Enterprise'}<br />
                Billing Account: Authorized Corporate Client
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-slate-400 print:text-gray-500 uppercase tracking-wider block mb-1">
                Contract Reference:
              </span>
              <h4 className="text-sm font-bold text-emerald-400 print:text-black">{project.title}</h4>
              <p className="text-slate-300 print:text-gray-700 mt-0.5">
                Target Deadline: {project.deadline || '2026'}<br />
                Delivery Phase: {project.status.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Deliverables / Milestones Table */}
          <div>
            <span className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider block mb-2">
              Deliverable Items & Milestone Sprints
            </span>
            <div className="border border-slate-800 print:border-gray-300 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/60 print:bg-gray-100 text-slate-400 print:text-gray-700 border-b border-slate-800 print:border-gray-300">
                    <th className="p-3 font-semibold">Item & Scope Description</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                    <th className="p-3 font-semibold text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                  {milestones.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/20">
                      <td className="p-3">
                        <span className="font-medium text-slate-100 print:text-black block">{m.title}</span>
                        <span className="text-[10px] text-slate-400 print:text-gray-500 font-mono">
                          Target Completion: {m.deadline || 'Milestone Phase'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          m.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 print:text-green-700'
                            : 'bg-amber-500/20 text-amber-300 print:text-orange-700'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-white print:text-black">
                        ${Number(m.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Calculation & Payment Wire Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-800 print:border-gray-300">
            <div className="text-xs text-slate-400 print:text-gray-600 max-w-sm">
              <div className="flex items-center space-x-1.5 text-slate-300 print:text-black font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Wire Transfer / Payment Instructions</span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed">
                Beneficiary: ClientScope Global Solutions LLC<br />
                Routing/Swift: CHASEUS33 / BOFAUS3N<br />
                Terms: Net 15 days upon milestone verification.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Milestone Subtotal:</span>
                <span className="font-mono text-white print:text-black">${billableAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Standard Tax (10%):</span>
                <span className="font-mono text-white print:text-black">${taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 print:border-gray-300 text-sm font-bold text-white print:text-black">
                <span className="text-emerald-400 print:text-black">Total Due:</span>
                <span className="font-mono text-emerald-400 print:text-black">${totalWithTax.toLocaleString()} USD</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
