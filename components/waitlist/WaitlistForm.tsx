'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TradeSelect } from '@/components/ui/trade-select';
import { useLocationData } from '@/hooks/useLocationData';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

type UserType = 'student' | 'employer' | 'immigration_consultant' | 'international_worker' | 'mentor';

interface WaitlistFormProps {
  defaultUserType?: UserType | null;
}

export function WaitlistForm({ defaultUserType }: WaitlistFormProps) {
  const [userType, setUserType] = useState<UserType | ''>(defaultUserType || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Use existing location data hook
  const {
    countries,
    regions,
    loadingCountries,
    loadingRegions,
    fetchRegions,
    getRegionLabel,
    hasRegions,
  } = useLocationData();

  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: 'Canada', // Default to Canada
    province: '',
    city: '',

    // Student/International worker fields
    trade: '',
    is_apprentice: '', // 'yes' or 'no'
    apprenticeship_year: '',
    is_challenging: '', // 'yes' or 'no'
    challenge_date: '',

    // Employer fields
    company_name: '',
    industry: '',
    industry_other: '',
    hiring_needs: '',

    // Immigration consultant fields
    rcic_number: '',

    // International worker fields
    experience_years: '',

    // Mentor fields
    mentor_trade: '',
    years_experience: '',
    certification_level: '',
  });

  // Fetch regions when country changes
  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countries.find(c => c.name_en === formData.country);
      if (selectedCountry && hasRegions(selectedCountry.code)) {
        fetchRegions(selectedCountry.code);
        // Reset province when country changes
        setFormData(prev => ({ ...prev, province: '' }));
      }
    }
  }, [formData.country, countries]);

  // Update user type when prop changes
  useEffect(() => {
    if (defaultUserType) {
      setUserType(defaultUserType);
    }
  }, [defaultUserType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if email is invalid
    if (emailError) {
      setError('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_type: userType,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-background shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h3 className="text-3xl font-bold mb-3 text-foreground text-center">You're on the list!</h3>
        <p className="text-muted-foreground mb-4 text-center text-lg">
          Thanks for joining the waitlist. We'll email you as soon as we launch.
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Check your inbox for a confirmation email (check spam if you don't see it).
        </p>
      </div>
    );
  }

  const selectedCountry = countries.find(c => c.name_en === formData.country);
  const showRegionField = selectedCountry && hasRegions(selectedCountry.code);

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-2xl border-2 border-border bg-card space-y-6 shadow-lg">
      {/* User Type Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">I'm interested as a:</Label>
          {userType && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUserType('')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Change
            </Button>
          )}
        </div>

        {!userType ? (
          <RadioGroup
            value={userType}
            onValueChange={(value) => setUserType(value as UserType)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary transition-all cursor-pointer hover:shadow-md">
              <RadioGroupItem value="student" id="student" />
              <Label
                htmlFor="student"
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                <span className="font-semibold text-base">Student/Apprentice</span>
                <span className="text-muted-foreground block text-xs mt-1">
                  Preparing for Red Seal certification
                </span>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary transition-all cursor-pointer hover:shadow-md">
              <RadioGroupItem value="employer" id="employer" />
              <Label
                htmlFor="employer"
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                <span className="font-semibold text-base">Employer</span>
                <span className="text-muted-foreground block text-xs mt-1">
                  Looking to hire skilled workers
                </span>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary transition-all cursor-pointer hover:shadow-md">
              <RadioGroupItem value="immigration_consultant" id="immigration_consultant" />
              <Label
                htmlFor="immigration_consultant"
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                <span className="font-semibold text-base">Immigration Consultant (RCIC)</span>
                <span className="text-muted-foreground block text-xs mt-1">
                  Supporting clients with Canadian immigration
                </span>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary transition-all cursor-pointer hover:shadow-md">
              <RadioGroupItem value="international_worker" id="international_worker" />
              <Label
                htmlFor="international_worker"
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                <span className="font-semibold text-base">International Student</span>
                <span className="text-muted-foreground block text-xs mt-1">
                  Planning to study and work in Canada
                </span>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary transition-all cursor-pointer hover:shadow-md">
              <RadioGroupItem value="mentor" id="mentor" />
              <Label
                htmlFor="mentor"
                className="flex-1 cursor-pointer text-sm font-normal"
              >
                <span className="font-semibold text-base">Mentor/Instructor</span>
                <span className="text-muted-foreground block text-xs mt-1">
                  Share knowledge with apprentices
                </span>
              </Label>
            </div>
          </RadioGroup>
        ) : (
          <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
            <span className="font-semibold text-base">
              {userType === 'student' && 'Student/Apprentice'}
              {userType === 'employer' && 'Employer'}
              {userType === 'immigration_consultant' && 'Immigration Consultant (RCIC)'}
              {userType === 'international_worker' && 'International Student'}
              {userType === 'mentor' && 'Mentor/Instructor'}
            </span>
          </div>
        )}
      </div>

      {/* Common Fields */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => {
              const email = e.target.value;
              setFormData({ ...formData, email });

              // Validate email format
              if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setEmailError('Please enter a valid email address');
              } else {
                setEmailError(null);
              }
            }}
            onBlur={() => {
              // Final validation on blur
              if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                setEmailError('Please enter a valid email address');
              }
            }}
            required
            className={`h-11 ${emailError ? 'border-destructive' : ''}`}
          />
          {emailError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              {emailError}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <PhoneInput
            id="phone"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            required
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Auto-formats as you type
          </p>
        </div>

        {/* Location Fields */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => setFormData({ ...formData, country: value })}
              disabled={loadingCountries}
            >
              <SelectTrigger id="country" className="h-11">
                <SelectValue placeholder={loadingCountries ? 'Loading countries...' : 'Select country'} />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name_en}>
                    {country.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showRegionField && (
            <div className="space-y-2">
              <Label htmlFor="province">{getRegionLabel(selectedCountry.code)} *</Label>
              <Select
                value={formData.province}
                onValueChange={(value) => setFormData({ ...formData, province: value })}
                disabled={loadingRegions}
              >
                <SelectTrigger id="province" className="h-11">
                  <SelectValue placeholder={loadingRegions ? 'Loading...' : `Select ${getRegionLabel(selectedCountry.code).toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.name_en}>
                      {region.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              type="text"
              placeholder="Toronto"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Conditional Fields Based on User Type */}
      {userType === 'student' && (
        <div className="space-y-6 pt-4 border-t border-border">
          {/* Step 1: Select Trade */}
          <TradeSelect
            value={formData.trade}
            onValueChange={(value) => setFormData({ ...formData, trade: value })}
            label="What trade are you studying? *"
            placeholder="Select your trade"
          />

          {/* Step 2: Are you an apprentice? (only shows after trade selected) */}
          {formData.trade && (
            <div className="space-y-3 animate-fade-in">
              <Label className="text-base font-semibold">Are you currently an apprentice?</Label>
              <RadioGroup
                value={formData.is_apprentice}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    is_apprentice: value,
                    // Reset dependent fields
                    apprenticeship_year: '',
                    is_challenging: '',
                    challenge_date: ''
                  });
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer flex-1">
                  <RadioGroupItem value="yes" id="apprentice-yes" />
                  <Label htmlFor="apprentice-yes" className="cursor-pointer font-medium">
                    Yes, I'm an apprentice
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer flex-1">
                  <RadioGroupItem value="no" id="apprentice-no" />
                  <Label htmlFor="apprentice-no" className="cursor-pointer font-medium">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3a: If apprentice YES → What year? */}
          {formData.is_apprentice === 'yes' && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="apprenticeship_year" className="text-base font-semibold">What year are you in? *</Label>
              <Select
                value={formData.apprenticeship_year}
                onValueChange={(value) => setFormData({ ...formData, apprenticeship_year: value })}
              >
                <SelectTrigger id="apprenticeship_year" className="h-11">
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Year 1">Year 1</SelectItem>
                  <SelectItem value="Year 2">Year 2</SelectItem>
                  <SelectItem value="Year 3">Year 3</SelectItem>
                  <SelectItem value="Year 4">Year 4</SelectItem>
                  <SelectItem value="Year 5">Year 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 3b: If apprentice NO → Planning to challenge? */}
          {formData.is_apprentice === 'no' && (
            <div className="space-y-3 animate-fade-in">
              <Label className="text-base font-semibold">Are you planning to challenge your Red Seal?</Label>
              <RadioGroup
                value={formData.is_challenging}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    is_challenging: value,
                    challenge_date: '' // Reset date if they change answer
                  });
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer flex-1">
                  <RadioGroupItem value="yes" id="challenge-yes" />
                  <Label htmlFor="challenge-yes" className="cursor-pointer font-medium">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer flex-1">
                  <RadioGroupItem value="no" id="challenge-no" />
                  <Label htmlFor="challenge-no" className="cursor-pointer font-medium">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 4: If challenging YES → When? (Date picker) */}
          {formData.is_challenging === 'yes' && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="challenge_date" className="text-base font-semibold">When are you planning to challenge? *</Label>
              <Input
                id="challenge_date"
                type="date"
                value={formData.challenge_date}
                onChange={(e) => setFormData({ ...formData, challenge_date: e.target.value })}
                className="h-11"
                min={new Date().toISOString().split('T')[0]} // Can't select past dates
              />
            </div>
          )}
        </div>
      )}

      {userType === 'employer' && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              type="text"
              placeholder="Your Company Inc."
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => setFormData({ ...formData, industry: value, industry_other: value === 'other' ? formData.industry_other : '' })}
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="automotive">Automotive & Transportation</SelectItem>
                <SelectItem value="industrial">Industrial & Heavy Equipment</SelectItem>
                <SelectItem value="energy">Energy & Utilities</SelectItem>
                <SelectItem value="food_services">Food Services & Hospitality</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.industry === 'other' && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="industry_other">Please specify your industry *</Label>
              <Input
                id="industry_other"
                type="text"
                placeholder="e.g., Mining, Landscaping, HVAC Services"
                value={formData.industry_other}
                onChange={(e) => setFormData({ ...formData, industry_other: e.target.value })}
                required
                className="h-11"
              />
            </div>
          )}

          <div className="space-y-3">
            <Label>What trades are you hiring for? * <span className="text-sm text-muted-foreground font-normal">(Select all that apply)</span></Label>
            <p className="text-sm text-muted-foreground">
              Select all the trades you have open positions for
            </p>
            <TradeSelect
              value={formData.hiring_needs}
              onValueChange={(value) => {
                // Allow multiple selections - append to existing or create new list
                const currentTrades = formData.hiring_needs ? formData.hiring_needs.split(',') : [];
                if (currentTrades.includes(value)) {
                  // Remove if already selected
                  const updated = currentTrades.filter(t => t !== value).join(',');
                  setFormData({ ...formData, hiring_needs: updated });
                } else {
                  // Add to list
                  const updated = [...currentTrades, value].filter(Boolean).join(',');
                  setFormData({ ...formData, hiring_needs: updated });
                }
              }}
              label=""
              placeholder="Select trade to add"
            />
            {formData.hiring_needs && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.hiring_needs.split(',').filter(Boolean).map((trade) => {
                  // Format trade name: convert snake_case to Title Case
                  const formattedName = trade
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <div
                      key={trade}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
                    >
                      <span>{formattedName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.hiring_needs
                            .split(',')
                            .filter(t => t !== trade)
                            .join(',');
                          setFormData({ ...formData, hiring_needs: updated });
                        }}
                        className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {userType === 'immigration_consultant' && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-2">
            <Label htmlFor="rcic_number">RCIC Number</Label>
            <Input
              id="rcic_number"
              type="text"
              placeholder="R123456 (optional)"
              value={formData.rcic_number}
              onChange={(e) => setFormData({ ...formData, rcic_number: e.target.value })}
              className="h-11"
            />
          </div>
        </div>
      )}

      {userType === 'international_worker' && (
        <div className="space-y-4 pt-4 border-t border-border">
          <TradeSelect
            value={formData.trade}
            onValueChange={(value) => setFormData({ ...formData, trade: value })}
            label="What trade do you work in? *"
            placeholder="Select your trade"
          />

          <div className="space-y-2">
            <Label htmlFor="experience_years">Years of Experience</Label>
            <Input
              id="experience_years"
              type="text"
              placeholder="e.g., 5 years (optional)"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              className="h-11"
            />
          </div>
        </div>
      )}

      {userType === 'mentor' && (
        <div className="space-y-4 pt-4 border-t border-border">
          <TradeSelect
            value={formData.mentor_trade}
            onValueChange={(value) => setFormData({ ...formData, mentor_trade: value })}
            label="What trade do you mentor in? *"
            placeholder="Select your trade"
          />

          <div className="space-y-2">
            <Label htmlFor="years_experience">Years of Experience *</Label>
            <Input
              id="years_experience"
              type="text"
              placeholder="e.g., 15 years"
              value={formData.years_experience}
              onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certification_level">Certification Level</Label>
            <Select
              value={formData.certification_level}
              onValueChange={(value) => setFormData({ ...formData, certification_level: value })}
            >
              <SelectTrigger id="certification_level" className="h-11">
                <SelectValue placeholder="Select certification (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Red Seal Certified">Red Seal Certified</SelectItem>
                <SelectItem value="Journeyperson">Journeyperson</SelectItem>
                <SelectItem value="Instructor Certificate">Instructor Certificate</SelectItem>
                <SelectItem value="Master Craftsperson">Master Craftsperson</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Joining Waitlist...
          </>
        ) : (
          'Join the Waitlist'
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        * Required fields
      </p>
    </form>
  );
}
