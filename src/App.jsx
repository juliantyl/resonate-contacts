import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Briefcase, Globe, MapPin, Building } from 'lucide-react';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  // fetch from the json placeholder
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContacts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setContacts([]);
        console.error("Error fetching contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []); 

  // only show contacts that include the search term (search bar is empty by default so will show all)
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // handle viewing details
  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
  };

  // close viewing details
  const handleCloseModal = () => {
    setSelectedContact(null);
  };

  // loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-xl">Loading contacts...</p>
      </div>
    );
  }

  // error screen
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-slate-900 text-red-400 p-4">
        <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong.</h2>
        <p className="text-lg">Failed to load contacts: {error}</p>
        <p className="mt-4 text-sm">Please try refreshing the page or check your internet connection.</p>
      </div>
    );
  }
  
  // meat of the application (after it loads)
  return (
    // title with a slick gradient
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 font-sans p-4 sm:p-6 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-800 pb-3">
          My Contacts
        </h1>
        <p className="text-slate-500 text-lg">Browse and manage your professional network.</p>
      </header>

      {/* search bar */}
      <div className="mb-8 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          className="w-full p-3 sm:p-4 bg-slate-700 border border-slate-600 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* grid of contact cards */}
      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredContacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} onViewDetails={handleViewDetails} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users size={64} className="mx-auto text-slate-500 mb-4" />
          <p className="text-xl text-slate-400">No contacts found matching your search.</p>
          <p className="text-slate-500">Try a different search term or clear the search.</p>
        </div>
      )}
      
      {/* contact detail (when you click on it) */}
      {selectedContact && (
        <ContactModal contact={selectedContact} onClose={handleCloseModal} />
      )}

      {/* A footer because it looks nice */}
      <footer className="text-center mt-12 py-6 border-t border-slate-700">
        <p className="text-slate-500 text-sm">made by Julian Tyl for ResonateCX assignment</p>
      </footer>
    </div>
  );
};

// contact card
const ContactCard = ({ contact, onViewDetails }) => {
  return (
    // full card, enlarges on hover
    <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between">
      {/* container for whole card except view details section */}
      <div className="p-5 sm:p-6">
        {/* icon + name */}
        <div className="flex items-center mb-4">
          {/* icon */}
          <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          {/* name and company name below it */}
          <div className="ml-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 leading-tight">{contact.name}</h3>
            <p className="text-sm text-slate-400 flex items-center mt-1">
              <Briefcase size={14} className="mr-2 text-slate-500" />
              {contact.company.name}
            </p>
          </div>
        </div>
        
        {/* email, phone, website */}
        <div className="space-y-2 text-sm">
          <p className="text-slate-300 flex items-center">
            <Mail size={14} className="mr-2 text-slate-500" />
            <a href={`mailto:${contact.email}`} className="hover:text-blue-400 transition-colors duration-200 truncate" title={contact.email}>{contact.email}</a>
          </p>
          <p className="text-slate-300 flex items-center">
            <Phone size={14} className="mr-2 text-slate-500" />
            <a href={`tel:${contact.phone}`} className="hover:text-blue-400 transition-colors duration-200">{contact.phone}</a>
          </p>
          <p className="text-slate-300 flex items-center">
            <Globe size={14} className="mr-2 text-slate-500" />
            <a href={`http://${contact.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-200 truncate" title={contact.website}>{contact.website}</a>
          </p>
        </div>
      </div>
      {/* view details button section */}
      <div className="bg-slate-700/50 px-5 py-3 sm:px-6 sm:py-4">
        <button
          onClick={() => onViewDetails(contact)}
          className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// contact modal
const ContactModal = ({ contact, onClose }) => {
  if (!contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-lg shadow-2xl max-w-lg w-full mx-auto overflow-hidden transform transition-all duration-300 ease-out scale-95 animate-modal-enter">
        <div className="p-6 sm:p-8">
          {/* top section */}
          <div className="flex items-start justify-between mb-6">
            {/* icon and name, with username? below */}
            <div className="flex items-center">
              <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-400">{contact.name}</h2>
                <p className="text-slate-200 text-sm">{contact.username}</p>
              </div>
            </div>
          </div>

          {/* the full shbang*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <InfoItem icon={<Mail size={18} className="text-teal-400" />} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
            <InfoItem icon={<Phone size={18} className="text-teal-400" />} label="Phone" value={contact.phone} href={`tel:${contact.phone}`} />
            <InfoItem icon={<Globe size={18} className="text-teal-400" />} label="Website" value={contact.website} href={`http://${contact.website}`} target="_blank" />
            
            <div className="md:col-span-2 mt-2">
              <h4 className="text-slate-300 font-semibold mb-1 flex items-center"><Building size={18} className="mr-2 text-teal-400"/>Company</h4>
              <p className="text-slate-200 font-bold">{contact.company.name}</p>
              <p className="text-slate-400 italic">"{contact.company.catchPhrase}"</p>
              <p className="text-slate-400 text-xs">{contact.company.bs}</p>
            </div>

            <div className="md:col-span-2 mt-2">
              <h4 className="text-slate-300 font-semibold mb-1 flex items-center"><MapPin size={18} className="mr-2 text-teal-400"/>Address</h4>
              <p className="text-slate-200">{contact.address.street}, {contact.address.suite}</p>
              <p className="text-slate-200">{contact.address.city}, {contact.address.zipcode}</p>
              <p className="text-slate-400 text-xs mt-1">Geo: {contact.address.geo.lat}, {contact.address.geo.lng}</p>
            </div>
          </div>
        </div>
        {/* close button on the right seems about right */}
        <div className="bg-slate-700/50 px-6 py-4 text-right">
            <button
              onClick={onClose}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              Close
            </button>
        </div>
      </div>
      {/* very cool animation for when you click. very cool.. took long time... */}
      <style jsx global>{`
        @keyframes modal-enter-anim {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal-enter {
          animation: modal-enter-anim 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// info item is just a helper for those little icons + text
const InfoItem = ({ icon, label, value, href, target }) => (
  <div>
    <h4 className="text-slate-300 font-semibold mb-0.5 flex items-center">{icon}<span className="ml-2">{label}</span></h4>
    {href ? (
      <a 
        href={href} 
        target={target || '_self'} 
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className="text-slate-200 hover:text-teal-300 transition-colors duration-200 break-words"
      >
        {value}
      </a>
    ) : (
      <p className="text-slate-200 break-words">{value}</p>
    )}
  </div>
);


export default App;
