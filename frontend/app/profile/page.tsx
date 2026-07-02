'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Award, Calendar, CheckCircle, ShieldAlert, User } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import LoadingButton from '@/components/ui/LoadingButton';
import PasswordStrength from '@/components/ui/PasswordStrength';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { AuthService } from '@/services/auth.service';
import { ProfileService } from '@/services/profile.service';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [fullNameState, setFullNameState] = useState('');
  const [avatarUrlState, setAvatarUrlState] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const data = await ProfileService.getProfile(user.id);
        if (data) {
          setFullNameState(data.fullName || '');
          setAvatarUrlState(data.avatarUrl || '');
        } else {
          setFullNameState(user.user_metadata?.full_name || 'Art Collector');
          setAvatarUrlState(user.user_metadata?.avatar_url || '');
        }
      } catch (e) {
        console.error('Failed to load profile details:', e);
      } finally {
        setIsInitialized(true);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center font-sans text-xs text-secondary">
          Loading profile...
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  const email = user.email || '';
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';
  const isVerified = !!user.email_confirmed_at;

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      addToast('Successfully logged out of your account.', 'info');
      router.push('/');
    } catch {
      addToast('Failed to sign out. Please try again.', 'error');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await ProfileService.uploadAvatar(user.id, file);
      setAvatarUrlState(publicUrl);
      addToast('Profile avatar uploaded and saved!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to upload avatar photo.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileUpdating(true);
    try {
      await ProfileService.updateProfile(user.id, fullNameState, avatarUrlState);
      addToast('Profile details updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to update profile details.', 'error');
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setFormLoading(true);

    try {
      await AuthService.updatePassword(password);
      setFormSuccess(true);
      setPassword('');
      setConfirmPassword('');
      addToast('Password updated successfully!', 'success');
    } catch (err) {
      setFormError(AuthService.mapAuthError(err));
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs customLabels={{ profile: 'Your Account' }} />

      <PageWrapper className="pt-8 font-sans">
        <Section padding="none" className="pb-24">
          <Container>
            {/* Header */}
            <div className="mb-12">
              <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium block mb-2">
                COLLECTOR DASHBOARD
              </span>
              <h1 className="font-cormorant text-4xl md:text-5xl font-light text-primary tracking-wide">
                Your Profile
              </h1>
              <div className="w-12 h-[1px] bg-accent mt-4" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Profile Card Summary */}
              <div className="bg-white border border-primary/5 p-8 flex flex-col items-center text-center space-y-6">
                {/* Avatar Area */}
                <div className="relative w-24 h-24 rounded-full border border-primary/5 bg-[#FAF7F2] overflow-hidden group">
                  {avatarUrlState ? (
                    <Image
                      src={avatarUrlState}
                      alt="Avatar"
                      className="object-cover rounded-full"
                      fill
                    />
                  ) : (
                    <User className="w-10 h-10 stroke-[1.2] text-secondary/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}

                  {/* Upload Overlay */}
                  <label className="absolute inset-0 bg-primary/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[10px] text-white uppercase tracking-widest font-semibold cursor-pointer">
                    <span>{isUploading ? 'Uploading...' : 'Change'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  {isVerified && (
                    <span
                      className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 z-10"
                      title="Verified Account"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                    </span>
                  )}
                </div>

                {/* Meta details */}
                <div className="space-y-1">
                  <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide">
                    {isInitialized ? fullNameState : 'Loading...'}
                  </h3>
                  <p className="text-xs text-secondary font-light">{email}</p>
                </div>

                <div className="w-full border-t border-primary/5 my-4 pt-6 space-y-4 text-xs text-left">
                  <div className="flex items-center gap-3 text-secondary">
                    <Calendar className="w-4 h-4 text-secondary/60" />
                    <span>Member since: {memberSince}</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary">
                    <Award className="w-4 h-4 text-secondary/60" />
                    <span>Level: Elite Art Patron</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary">
                    {isVerified ? (
                      <div className="flex items-center gap-3 text-emerald-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Email Confirmed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-amber-600">
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        <span>Verification Pending</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full pt-4">
                  <Button variant="outline" fullWidth onClick={handleLogout}>
                    Log Out Account
                  </Button>
                </div>
              </div>

              {/* Edit Details Panel */}
              <div className="lg:col-span-2 space-y-8">
                {/* Account Details View */}
                <form
                  onSubmit={handleProfileUpdate}
                  className="bg-white border border-primary/5 p-8 space-y-6"
                >
                  <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide border-b border-primary/5 pb-3">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullNameState}
                        onChange={(e) => setFullNameState(e.target.value)}
                        className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-secondary font-sans uppercase tracking-wider block">
                        Email Address
                      </span>
                      <span className="text-secondary/60 font-medium block p-2.5 bg-[#FAF7F2] border border-primary/5 select-none">
                        {email}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <LoadingButton
                      type="submit"
                      variant="primary"
                      loading={isProfileUpdating}
                      className="w-full md:w-auto md:px-8"
                    >
                      Save Details
                    </LoadingButton>
                  </div>
                </form>

                {/* Password Change Form */}
                <div className="bg-white border border-primary/5 p-8 space-y-6">
                  <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide border-b border-primary/5 pb-3">
                    Change Security Password
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    {formError && (
                      <div className="bg-red-50 text-red-700 border border-red-100 p-3 text-xs font-sans">
                        {formError}
                      </div>
                    )}
                    {formSuccess && (
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 text-xs font-sans">
                        Password updated successfully.
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary"
                        />
                        <PasswordStrength password={password} />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent text-primary"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <LoadingButton
                        type="submit"
                        variant="primary"
                        loading={formLoading}
                        className="w-full md:w-auto md:px-8"
                      >
                        Update Password
                      </LoadingButton>
                    </div>
                  </form>
                </div>

                {/* Coming soon stubs panel */}
                <div className="bg-white border border-primary/5 p-8 space-y-4 opacity-70">
                  <h3 className="font-cormorant text-xl font-light text-primary tracking-wide">
                    Advanced Actions
                  </h3>
                  <div className="flex items-center justify-between text-xs pt-2">
                    <div>
                      <h4 className="font-semibold text-primary">Delete Account</h4>
                      <p className="text-secondary font-light text-[10px]">
                        Irreversibly delete your collector profile and records.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Delete (Coming Soon)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}
