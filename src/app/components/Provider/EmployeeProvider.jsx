'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Mock (default) employee. Replace via fetch later.
const mockEmployee = {
  adminId: '68aea10ba4d0d8f4b37327cc',
  username: 'nakasen',
  fullName: 'นาคเสน พุทธเจริญ',
  staffId: 'OKM011',
  centralRole: ['admin', 'ENGINEER'],
};

const EmployeeContext = createContext({
  employee: mockEmployee,
  loading: false,
  error: null,
  setEmployee: () => {},
  refresh: async () => {},
});

export function EmployeeProvider({
  children,
  staffId, // optional: when provided, provider will fetch employee by staffId
  initialEmployee = mockEmployee, // optional seed value
}) {
  const [employee, setEmployee] = useState(initialEmployee);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Match your project default: http://localhost:3000/api/v1
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

  const refresh = useCallback(async () => {
    if (!staffId) return employee; // keep current if no staffId to fetch
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/employees/check/${encodeURIComponent(staffId)}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch error ${res.status}: ${text || res.statusText}`);
      }
      const data = await res.json();
      setEmployee(data);
      return data;
    } catch (err) {
      if (err.name !== 'AbortError') setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_BASE, staffId, employee]);

  useEffect(() => {
    const controller = new AbortController();
    if (staffId) refresh(controller.signal);
    return () => controller.abort();
  }, [staffId, refresh]);

  const value = useMemo(
    () => ({
      employee,
      loading,
      error,
      setEmployee,
      refresh: () => refresh(), // convenience wrapper without AbortController
    }),
    [employee, loading, error, refresh],
  );

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}

export function useEmployee() {
  return useContext(EmployeeContext);
}

/**
 * Usage:
 *
 * // In root layout or a specific section:
 * <EmployeeProvider staffId="OKM011">
 *   <App />
 * </EmployeeProvider>
 *
 * // In any child component:
 * const { employee, loading, error, refresh, setEmployee } = useEmployee();
 */
