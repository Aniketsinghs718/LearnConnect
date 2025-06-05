// Debug component to test marketplace connection
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const MarketplaceDebug: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<string>('Checking...');
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  const testDatabaseConnection = async () => {
    try {
      // Test 1: Check if we can connect to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      setDbStatus(user ? 'Connected (Authenticated)' : 'Connected (Not authenticated)');

      // Test 2: Check if marketplace_items table exists
      const { data: items, error: itemsError } = await supabase
        .from('marketplace_items')
        .select('*')
        .limit(1);

      if (itemsError) {
        setTestResult(`❌ Items table error: ${itemsError.message}`);
        return;
      }

      // Test 3: Check if marketplace_categories table exists
      const { data: categories, error: categoriesError } = await supabase
        .from('marketplace_categories')
        .select('*')
        .limit(1);

      if (categoriesError) {
        setTestResult(`❌ Categories table error: ${categoriesError.message}`);
        return;
      }

      // Test 4: Get table info
      const { count: itemCount } = await supabase
        .from('marketplace_items')
        .select('*', { count: 'exact', head: true });

      const { count: categoryCount } = await supabase
        .from('marketplace_categories')
        .select('*', { count: 'exact', head: true });

      setTableInfo({
        items: items || [],
        itemCount: itemCount || 0,
        categoryCount: categoryCount || 0,
        categories: categories || []
      });

      setTestResult('✅ All tables accessible');

    } catch (error: any) {
      setTestResult(`❌ Connection error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">🔍 Marketplace Debug Info</h3>
      
      <div className="space-y-3">
        <div>
          <strong>Database Status:</strong> {dbStatus}
        </div>
        
        <div>
          <strong>Test Result:</strong> {testResult}
        </div>
        
        {tableInfo && (
          <div>
            <strong>Table Info:</strong>
            <ul className="list-disc ml-6 mt-2">
              <li>Items count: {tableInfo.itemCount}</li>
              <li>Categories count: {tableInfo.categoryCount}</li>
              <li>Sample items: {tableInfo.items.length > 0 ? 'Found' : 'None'}</li>
              <li>Sample categories: {tableInfo.categories.length > 0 ? 'Found' : 'None'}</li>
            </ul>
          </div>
        )}
        
        <button
          onClick={testDatabaseConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retest Connection
        </button>
      </div>
    </div>
  );
};
