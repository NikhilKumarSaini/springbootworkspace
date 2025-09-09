import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  X,
  Eye,
  Square,
  CheckSquare,
  RotateCcw,
  Briefcase,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const App = () => {
  const [application, setApplication] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const navigate = useNavigate();

  // Fetch documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/documents/customer/APP001");
        const docs = await res.json();
        const formattedDocs = docs.map((doc) => ({
          name: doc.docType,
          file: {
            name: doc.fileName,
            url: `http://localhost:8080/uploads/${doc.fileName}`,
          },
          status: "unchecked",
          remark: "",
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

  const needsReview = application.documents.some(
    (doc) => doc.status !== "valid" && doc.status !== "unchecked"
  );

  const handleDocumentStatusChange = (docName, status) => {
    setApplication((prevApp) => ({
      ...prevApp,
      documents: prevApp.documents.map((doc) =>
        doc.name === docName ? { ...doc, status } : doc
      ),
    }));
  };

  const handleRemarkChange = (docName, remark) => {
    setApplication((prevApp) => ({
      ...prevApp,
      documents: prevApp.documents.map((doc) =>
        doc.name === docName ? { ...doc, remark } : doc
      ),
    }));
  };

  const handleReturn = () => {
    console.log(
      "Returning application to user with remarks:",
      application.documents
        .filter((doc) => doc.status !== "valid")
        .map((doc) => ({ name: doc.name, remark: doc.remark }))
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 sm:p-6 font-sans transition-all duration-300">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md text-sc-blue-600 hover:text-sc-blue-700 px-4 py-2 rounded-xl shadow-lg border border-white/20 transition-all duration-200 hover:bg-white transform hover:scale-105"
        title="Go Back"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-sm">Back</span>
      </button>

      <div className="flex flex-col md:flex-row w-full max-w-[88rem] gap-8 items-start animate-in slide-in-from-bottom-4 duration-500">
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          <Briefcase className="w-4 h-4" />
          Maker
        </div>

        {/* Main form container */}
        <div className="w-full md:w-2/5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-10 relative border border-white/30">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Document Validation
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Review and validate the documents for Application ID: {application.id}
          </p>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Uploaded Documents
            </h2>
            <ul className="space-y-4">
              {application.documents.map((doc) => (
                <div key={doc.name}>
                  <li
                    className={`flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border transition-all duration-200 ${
                      selectedDocument && selectedDocument.name === doc.name
                        ? "border-blue-300 bg-blue-50/60 shadow-md"
                        : "border-white/30 hover:bg-white/80"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {doc.status === "valid" && (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      )}
                      {doc.status === "invalid" && (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      {doc.status === "review" && (
                        <RotateCcw className="w-5 h-5 text-yellow-500" />
                      )}
                      {doc.status === "unchecked" && (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-800">{doc.name}</span>
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-all duration-200 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDocumentStatusChange(doc.name, "valid")}
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          doc.status === "valid"
                            ? "bg-green-500 text-white"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        Valid
                      </button>
                      <button
                        onClick={() => handleDocumentStatusChange(doc.name, "invalid")}
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          doc.status === "invalid"
                            ? "bg-red-500 text-white"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        Invalid
                      </button>
                      <button
                        onClick={() => handleDocumentStatusChange(doc.name, "review")}
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          doc.status === "review"
                            ? "bg-yellow-500 text-white"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                      >
                        Review
                      </button>
                    </div>
                  </li>
                  <AnimatePresence>
                    {(doc.status === "invalid" || doc.status === "review") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-2 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/30"
                      >
                        <label
                          htmlFor={`remark-${doc.name}`}
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Remark for {doc.name}
                        </label>
                        <textarea
                          id={`remark-${doc.name}`}
                          name={`remark-${doc.name}`}
                          rows="2"
                          value={doc.remark}
                          onChange={(e) => handleRemarkChange(doc.name, e.target.value)}
                          placeholder="Add a remark for the applicant..."
                          className="w-full p-3 rounded-xl border border-white/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white/80 backdrop-blur-sm"
                        ></textarea>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </ul>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleReturn}
              disabled={!needsReview}
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-red-700 shadow-lg hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Applicant
            </button>

            <Link
              to="/maker-data-validation"
              className="inline-flex items-center rounded-xl border border-transparent bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-medium text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 transform hover:scale-105"
            >
              Proceed to Data Validation
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="w-full md:w-3/5 h-[80vh] bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/30 overflow-y-auto sticky top-4 flex items-center justify-center">
          {selectedDocument ? (
            <div className="w-full h-full flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Viewing: {selectedDocument.name}
              </h3>
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
