import React, { useState, useEffect } from "react";
import { ArrowLeft, X, Eye, Square, CheckSquare, RotateCcw, FileText, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MakerDocumentValidation = () => {
  const [application, setApplication] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Backend se documents fetch karna
    axios
      .get("http://localhost:8080/api/documents?customerId=APP001")
      .then((res) => {
        // Backend se aane wala format assume: { id, applicantName, loanType, documents: [{ name, file: { url }, status, remark }] }
        setApplication(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching documents:", err);
        setError("Failed to load application data");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading…</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!application) return <p className="text-center mt-10 text-gray-500">No application found</p>;

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
          Maker
        </div>

        {/* Documents List */}
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
                  <li
                    className={`flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border transition-all duration-200 ${
                      selectedDocument && selectedDocument.name === doc.name
                        ? "border-teal-300 bg-teal-50/60 shadow-md"
                        : "border-white/30 hover:bg-white/80"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {doc.status === "valid" && <CheckSquare className="w-5 h-5 text-green-500" />}
                      {doc.status === "invalid" && <X className="w-5 h-5 text-red-500" />}
                      {doc.status === "review" && <RotateCcw className="w-5 h-5 text-yellow-500" />}
                      {doc.status === "unchecked" && <Square className="w-5 h-5 text-gray-400" />}
                      <span className="font-medium text-gray-800">{doc.name}</span>
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-all duration-200 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-teal-50"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          doc.status === "valid"
                            ? "bg-green-100 text-green-700"
                            : doc.status === "invalid"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {doc.status.toUpperCase()}
                      </span>
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

export default MakerDocumentValidation;
