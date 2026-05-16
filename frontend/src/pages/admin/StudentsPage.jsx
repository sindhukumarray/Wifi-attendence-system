import React, { useEffect } from 'react';
import useAdmin from '../../hooks/useAdmin';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';

const StudentsPage = () => {
  const { loading, students, fetchStudents } = useAdmin();

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Students</h1>
            <p className="text-slate-500 font-medium mt-1">Manage all registered students</p>
          </div>
        </div>

        {loading ? (
          <FacultySkeleton type="table" />
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="uppercase tracking-wider border-b-2 border-gray-100 bg-gray-50 text-gray-600 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Roll No</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{student.name}</td>
                        <td className="px-6 py-4 font-mono text-slate-600">{student.roll_no}</td>
                        <td className="px-6 py-4 text-slate-500">{student.email}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{student.department_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(student.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-medium">
                        No students registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Footer row count */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs font-semibold text-slate-400">
                Total Students: <span className="text-slate-600 font-bold">{students.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
