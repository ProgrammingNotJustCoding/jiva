import React from "react";
import { BsLinkedin, BsTwitterX } from "react-icons/bs";
import { CgMail } from "react-icons/cg";
import { FaFacebook } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-cyan-500">Jiva</h2>
            <p className="mt-4 text-gray-600">
              Making coal mine operations safer and more productive through
              intuitive digital solutions.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-500">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-500">
                <BsTwitterX size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-500">
                <BsLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-500">
                <CgMail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-cyan-500">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-cyan-500">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-cyan-500">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-cyan-500">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-cyan-500">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-cyan-500">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-cyan-500">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-cyan-500">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600">support@jiva.com</li>
              <li className="text-gray-600">+91 XXX XXX XXXX</li>
              <li className="text-gray-600">
                123 Mining Street, Coal City, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Jiva. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-cyan-500">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-cyan-500">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-cyan-500">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
