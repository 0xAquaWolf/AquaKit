'use client';

import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';

import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';

export function AccountLinkingTest() {
  const [testEmail, setTestEmail] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  
  // Debug queries
  const userAccounts = useQuery(api.auth.debugUserAccounts);
  const emailSearch = useQuery(api.auth.debugFindUsersByEmail, 
    testEmail ? { email: testEmail } : 'skip'
  );
  
  // Mutation for clearing users
  const clearAllUsers = useMutation(api.auth.devClearAllUsers);

  const handleLinkProvider = async (provider: 'google' | 'github' | 'discord') => {
    setIsLinking(true);
    try {
      await authClient.linkSocial({ provider });
    } catch (error) {
      console.error('Error linking provider:', error);
    } finally {
      setIsLinking(false);
    }
  };

  const handleClearAllUsers = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will DELETE ALL USERS from your database!\n\n' +
      'This action is IRREVERSIBLE and should only be used in development.\n\n' +
      'Are you absolutely sure you want to continue?'
    );
    
    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type "DELETE_ALL_USERS_CONFIRM" to proceed:'
    );
    
    if (doubleConfirm !== 'DELETE_ALL_USERS_CONFIRM') {
      alert('Operation cancelled - confirmation phrase not matched.');
      return;
    }

    setIsClearing(true);
    try {
      const result = await clearAllUsers({
        confirmDeletion: 'DELETE_ALL_USERS_CONFIRM',
        environment: 'development'
      });
      
      alert(`✅ ${result.message}`);
    } catch (error) {
      console.error('Error clearing users:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Failed to clear users: ${errorMessage}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Account Linking Debug Panel</h2>
        
        {/* Current User Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Current User</h3>
          {userAccounts?.currentUser ? (
            <div className="bg-green-50 p-3 rounded">
              <p><strong>User ID:</strong> {userAccounts.currentUser.userId}</p>
              <p><strong>Email:</strong> {userAccounts.currentUser.email}</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded">
              <p>No authenticated user</p>
            </div>
          )}
        </div>

        {/* Link Additional Providers */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Link Additional Providers</h3>
          <div className="space-x-2">
            <button
              onClick={() => handleLinkProvider('google')}
              disabled={isLinking}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Link Google
            </button>
            <button
              onClick={() => handleLinkProvider('github')}
              disabled={isLinking}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50"
            >
              Link GitHub
            </button>
            <button
              onClick={() => handleLinkProvider('discord')}
              disabled={isLinking}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              Link Discord
            </button>
          </div>
          {isLinking && <p className="text-sm text-gray-600 mt-2">Linking provider...</p>}
        </div>

        {/* Email Search */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Search Users by Email</h3>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter email to search..."
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => setTestEmail(testEmail)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Search
            </button>
          </div>
          
          {emailSearch && (
            <div className="mt-3 bg-gray-50 p-3 rounded">
              <p><strong>Results for:</strong> {emailSearch.email}</p>
              <p><strong>User Count:</strong> {emailSearch.userCount}</p>
              {emailSearch.userCount === 1 ? (
                <p className="text-green-600">✅ No duplicates - account linking working!</p>
              ) : emailSearch.userCount > 1 ? (
                <p className="text-red-600">❌ Multiple users found - potential duplicate accounts</p>
              ) : (
                <p className="text-gray-600">No users found with this email</p>
              )}
              
              {emailSearch.users.length > 0 && (
                <div className="mt-2">
                  <strong>Users:</strong>
                  <ul className="list-disc list-inside">
                    {emailSearch.users.map((user) => (
                      <li key={user.id} className="text-sm">
                        {user.name || 'No name'} ({user.email}) - Last auth: {user.lastAuthMethod || 'unknown'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* All Users Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-2">All Users Summary</h3>
          {userAccounts ? (
            <div className="bg-gray-50 p-3 rounded">
              <p><strong>Total Users:</strong> {userAccounts.totalUsers}</p>
              <div className="mt-2 max-h-40 overflow-y-auto">
                <strong>Recent Users:</strong>
                <ul className="list-disc list-inside text-sm">
                  {userAccounts.users.slice(-10).map((user) => (
                    <li key={user.id}>
                      {user.name || 'No name'} ({user.email}) - {user.lastAuthMethod || 'unknown'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded">
              <p>Loading user data...</p>
            </div>
          )}
        </div>

        {/* Database Cleanup */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Development Tools</h3>
          <div className="bg-red-50 border border-red-200 p-3 rounded">
            <p className="text-sm text-red-700 mb-2">
              ⚠️ <strong>Danger Zone:</strong> The button below will permanently delete all users from your database.
            </p>
            <button
              onClick={handleClearAllUsers}
              disabled={isClearing}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isClearing ? 'Clearing Database...' : '🗑️ Clear All Users (DEV ONLY)'}
            </button>
          </div>
        </div>
      </div>

      {/* Testing Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Testing Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Sign up with one provider (e.g., Google) using a test email</li>
          <li>Note the user count and search for your email above</li>
          <li>Log out and sign in with a different provider using the same email</li>
          <li>Check if the user count remains 1 (indicating successful linking)</li>
          <li>Use the &ldquo;Link Additional Providers&rdquo; buttons to manually link more providers</li>
        </ol>
      </div>
    </div>
  );
}