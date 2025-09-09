import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Eye, Square, CheckSquare, RotateCcw, FileText, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const App = () => {
  const [application, setApplication] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [checkerRemarks, setCheckerRemarks] = useState('');
  const navigate = useNavigate();

  // Fetch documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/documents/customer/APP001");
        const docs = await res.json();
        const formattedDocs = docs.map((doc) => ({
          name: doc.docType,
          file: { name: doc.fileName, url: `http://localhost:8080/uploads/${doc.fileName}` },
          status: doc.status, // Maker ka status
          remark: doc.remark || ''
        }));
        setApplication({
          id: "APP001",
          applicantName: "Demo Applicant",
          loanType: "Demo Loan",
          documents: formattedDocs,
        });
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, []);

  if (!application) return <div>Loading...</div>;

  const handleCheckerRemarkChange = (e) => setCheckerRemarks(e.target.value);

  const handleReturnToMaker = () => {
    console.log('Application Returned to Maker with remarks:', checkerRemarks);
    // Real app me status update aur notification yahan hoga
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center p-4 sm:p-6 font-sans transition-all duration-300">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md text-sc-green-600 hover:text-sc-green-700 px-4 py-2 rounded-xl shadow-lg border border-white/20 transition-all duration-200 hover:bg-white transform hover:scale-105"
        title="Go Back"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-sm">Back</span>
      </button>

      <div className="flex flex-col md:flex-row w-full max-w-[88rem] gap-8 items-start animate-in slide-in-from-bottom-4 duration-500">
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          <Briefcase className="w-4 h-4" />
          Checker
        </div>

        {/* Main form container */}
        <div className="w-full md:w-2/5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-10 relative border border-white/30">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Document Verification</h1>
          <p className="text-sm text-gray-600 mb-6">Verify the documents for Application ID: {application.id}</p>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Uploaded Documents
            </h2>
            <ul className="space-y-4">
              {application.documents.map((doc) => (
                <div key={doc.name}>
                  <li className={`flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border transition-all duration-200 ${
                    selectedDocument && selectedDocument.name === doc.name ? 'border-teal-300 bg-teal-50/60 shadow-md' : 'border-white/30 hover:bg-white/80'
                  }`}>
                    <div className="flex items-center gap-4">
                      {doc.status === 'valid' && <CheckSquare className="w-5 h-5 text-green-500" />}
                      {doc.status === 'invalid' && <X className="w-5 h-5 text-red-500" />}
                      {doc.status === 'review' && <RotateCcw className="w-5 h-5 text-yellow-500" />}
                      {doc.status === 'unchecked' && <Square className="w-5 h-5 text-gray-400" />}
                      <span className="font-medium text-gray-800">{doc.name}</span>
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-all duration-200 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-teal-50"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        doc.status === 'valid' ? 'bg-green-100 text-green-700' :
                        doc.status === 'invalid' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{doc.status.toUpperCase()}</span>
                    </div>
                  </li>
                  {doc.remark && (
                    <div className="mt-2 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/30">
                      <p className="text-xs font-medium text-gray-700 mb-1">Maker's Remark:</p>
                      <p className="text-sm text-gray-600 italic">{doc.remark}</p>
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <label htmlFor="checker-remarks" className="block text-sm font-medium text-gray-700 mb-2">Checker's Remarks</label>
            <textarea
              id="checker-remarks"
              name="checker-remarks"
              rows="4"
              value={checkerRemarks}
              onChange={handleCheckerRemarkChange}
              placeholder="Add your comments here..."
              className="mt-1 w-full p-3 rounded-xl border border-white/50 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm bg-white/80 backdrop-blur-sm"
            ></textarea>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleReturnToMaker}
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-red-700 shadow-lg hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Maker
            </button>
            <Link to="/checker-data-validation" className="inline-flex items-center rounded-xl border border-transparent bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-3 text-sm font-medium text-white shadow-lg hover:from-teal-700 hover:to-teal-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 transform hover:scale-105">
              Approve & Proceed
            </Link>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="w-full md:w-3/5 h-[80vh] bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/30 overflow-y-auto sticky top-4 flex items-center justify-center">
          {selectedDocument ? (
            <div className="w-full h-full flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Viewing: {selectedDocument.name}</h3>
              <div className="flex-grow bg-gradient-to-br from-gray-50/50 to-white/30 backdrop-blur-sm rounded-xl overflow-hidden flex items-center justify-center p-4 border border-white/20">
                <img
                  src={selectedDocument.file.url}
                  alt={selectedDocument.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-200 hover:scale-105"
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a document from the list to view it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
