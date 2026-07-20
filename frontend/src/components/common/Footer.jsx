const Footer = () => {
  return (
    <footer className="bg-white border-t py-4 mt-auto">
      <div className="container mx-auto text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} PAUD Management System. All Rights
        Reserved.
      </div>
    </footer>
  );
};

export default Footer;
