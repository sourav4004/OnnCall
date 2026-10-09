import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { UserSession } from '../types';
import { AppIcon } from './AppIcon';

interface ProVerificationModalProps {
  userSession?: UserSession;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onToast: (msg: string) => void;
}

export const ProVerificationModal: React.FC<ProVerificationModalProps> = ({
  userSession,
  isOpen,
  onClose,
  onComplete,
  onToast,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Per-step completion state tracking
  const [stepStatus, setStepStatus] = useState<Record<number, 'pending' | 'completed' | 'skipped'>>({
    1: 'pending',
    2: 'pending',
    3: 'pending',
    4: 'pending',
  });

  // Form State
  const [aadhaarNumber, setAadhaarNumber] = useState('8492 1048 2914');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [experienceYears, setExperienceYears] = useState('6');
  const [toolsChecked, setToolsChecked] = useState(true);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(true);
  const [selfieUploaded, setSelfieUploaded] = useState(true);

  if (!isOpen) return null;

  const handleNext = () => {
    setStepStatus((prev) => ({ ...prev, [step]: 'completed' }));

    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
      onToast(`Step ${step} saved!`);
    } else {
      onComplete();
      onToast('Profile submitted! Verified status activated.');
      onClose();
    }
  };

  const handleSkipCurrentStep = () => {
    setStepStatus((prev) => ({ ...prev, [step]: 'skipped' }));
    const stepNames: Record<number, string> = {
      1: 'Identity Verification',
      2: 'Bank & Payouts',
      3: 'Trade Credentials',
      4: 'Document Uploads',
    };
    onToast(`Skipped ${stepNames[step]}. You can update this anytime.`);

    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
    } else {
      onComplete();
      onToast('Profile setup finished with skipped items marked.');
      onClose();
    }
  };

  const handleSkipEntireVerification = () => {
    try {
      localStorage.setItem('oncall_pro_verification_dismissed', 'true');
    } catch {}
    onToast('You can complete profile verification later from Account settings.');
    onClose();
  };

  const stepsList = [
    { num: 1, title: 'ID Proof', subtitle: 'Aadhaar / Govt ID' },
    { num: 2, title: 'Payout', subtitle: 'Bank / UPI' },
    { num: 3, title: 'Trade Skills', subtitle: 'Experience' },
    { num: 4, title: 'Docs', subtitle: 'Selfie & Proof' },
  ];

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.shieldIcon}>
                <AppIcon name="shield" size={18} className="text-[#1E7A34]" />
              </View>
              <View>
                <Text style={styles.title}>Provider Verification</Text>
                <Text style={styles.subtitle}>
                  Required for OnnCall Guaranteed Pro Badge
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <AppIcon name="close" size={18} className="text-[#6B7280]" />
            </TouchableOpacity>
          </View>

          {/* Stepper Tabs */}
          <View style={styles.stepperRow}>
            {stepsList.map((s) => {
              const isActive = step === s.num;
              const isDone = stepStatus[s.num] === 'completed';
              const isSkipped = stepStatus[s.num] === 'skipped';

              return (
                <TouchableOpacity
                  key={s.num}
                  onPress={() => setStep(s.num as any)}
                  style={[
                    styles.stepTab,
                    isActive && styles.stepTabActive,
                    isDone && styles.stepTabDone,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNum,
                      isActive && styles.stepNumActive,
                      isDone && styles.stepNumDone,
                    ]}
                  >
                    {isDone ? '✓' : isSkipped ? '—' : s.num}
                  </Text>
                  <Text
                    style={[
                      styles.stepTitle,
                      isActive && styles.stepTitleActive,
                    ]}
                    numberOfLines={1}
                  >
                    {s.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.bodyContent}>
            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <View style={styles.formSection}>
                <Text style={styles.sectionHeader}>Aadhaar & PAN Verification</Text>
                <Text style={styles.sectionDesc}>
                  Enter your official identity details to accept instant customer bookings.
                </Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Aadhaar Card Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={aadhaarNumber}
                    onChangeText={setAadhaarNumber}
                    placeholder="XXXX XXXX XXXX"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Permanent Account Number (PAN)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={panNumber}
                    onChangeText={setPanNumber}
                    placeholder="e.g. ABCDE1234F"
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.infoBox}>
                  <AppIcon name="shield" size={16} className="text-[#1E7A34]" />
                  <Text style={styles.infoText}>
                    UIDAI verified with end-to-end cryptographic encryption.
                  </Text>
                </View>
              </View>
            )}

            {/* STEP 2: BANK / PAYOUT */}
            {step === 2 && (
              <View style={styles.formSection}>
                <Text style={styles.sectionHeader}>Bank Account & Payout Details</Text>
                <Text style={styles.sectionDesc}>
                  Where OnnCall will deposit your daily earnings and bonus tips.
                </Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Bank Account Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={bankAccount}
                    onChangeText={setBankAccount}
                    placeholder="e.g. 50100492817291"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>IFSC Code</Text>
                  <TextInput
                    style={styles.textInput}
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    placeholder="e.g. HDFC0000240"
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.skipNotice}>
                  <Text style={styles.skipNoticeText}>
                    Don't have bank details right now? Tap <Text style={styles.boldText}>Skip this Step</Text> below to provide this later before your first cashout.
                  </Text>
                </View>
              </View>
            )}

            {/* STEP 3: TRADE SKILLS */}
            {step === 3 && (
              <View style={styles.formSection}>
                <Text style={styles.sectionHeader}>Trade Credentials & Experience</Text>
                <Text style={styles.sectionDesc}>
                  Highlight your experience and tools to get higher rating tiers.
                </Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Years of Professional Experience</Text>
                  <TextInput
                    style={styles.textInput}
                    value={experienceYears}
                    onChangeText={setExperienceYears}
                    keyboardType="numeric"
                    placeholder="6"
                  />
                </View>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  activeOpacity={0.8}
                  onPress={() => setToolsChecked(!toolsChecked)}
                >
                  <View style={[styles.checkbox, toolsChecked && styles.checkboxActive]}>
                    {toolsChecked && <AppIcon name="check" size={12} className="text-white" />}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    I own professional grade tools and personal protective equipment (PPE).
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 4: DOC UPLOAD */}
            {step === 4 && (
              <View style={styles.formSection}>
                <Text style={styles.sectionHeader}>Upload Verification Photos</Text>
                <Text style={styles.sectionDesc}>
                  Selfie for in-app badge and photo of physical Aadhaar card.
                </Text>

                <View style={styles.uploadCardsRow}>
                  <TouchableOpacity
                    style={[styles.uploadBox, aadhaarUploaded && styles.uploadBoxDone]}
                    onPress={() => setAadhaarUploaded(!aadhaarUploaded)}
                  >
                    <AppIcon name="file" size={20} className={aadhaarUploaded ? 'text-[#1E7A34]' : 'text-[#6B7280]'} />
                    <Text style={styles.uploadTitle}>Aadhaar Card Photo</Text>
                    <Text style={styles.uploadStatus}>
                      {aadhaarUploaded ? '✓ Attached' : 'Tap to upload'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.uploadBox, selfieUploaded && styles.uploadBoxDone]}
                    onPress={() => setSelfieUploaded(!selfieUploaded)}
                  >
                    <AppIcon name="camera" size={20} className={selfieUploaded ? 'text-[#1E7A34]' : 'text-[#6B7280]'} />
                    <Text style={styles.uploadTitle}>Live Clear Selfie</Text>
                    <Text style={styles.uploadStatus}>
                      {selfieUploaded ? '✓ Attached' : 'Tap to capture'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <View style={styles.actionRow}>
              {/* Skip particular step button */}
              <TouchableOpacity
                onPress={handleSkipCurrentStep}
                style={styles.skipStepButton}
              >
                <Text style={styles.skipStepText}>Skip this Step</Text>
              </TouchableOpacity>

              {/* Continue / Finish button */}
              <TouchableOpacity
                onPress={handleNext}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  {step === 4 ? 'Submit Verification' : 'Save & Continue'}
                </Text>
                <AppIcon name="chevron-right" size={15} className="text-white" />
              </TouchableOpacity>
            </View>

            {/* Do this later option */}
            <TouchableOpacity
              onPress={handleSkipEntireVerification}
              style={styles.doLaterButton}
            >
              <Text style={styles.doLaterText}>I'll complete verification later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 410,
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  shieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E9F6EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 6,
  },
  stepTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stepTabActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#111111',
  },
  stepTabDone: {
    backgroundColor: '#E9F6EC',
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  stepNumActive: {
    color: '#111111',
  },
  stepNumDone: {
    color: '#1E7A34',
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepTitleActive: {
    color: '#111111',
    fontWeight: '700',
  },
  scrollBody: {
    maxHeight: 380,
  },
  bodyContent: {
    padding: 16,
  },
  formSection: {
    gap: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  sectionDesc: {
    fontSize: 12.5,
    color: '#6B7280',
    lineHeight: 18,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    backgroundColor: '#F9FAFB',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E9F6EC',
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 11.5,
    color: '#1E7A34',
    flex: 1,
  },
  skipNotice: {
    backgroundColor: '#FEF9C3',
    padding: 10,
    borderRadius: 10,
  },
  skipNoticeText: {
    fontSize: 12,
    color: '#854D0E',
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '700',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  checkboxLabel: {
    fontSize: 12.5,
    color: '#374151',
    flex: 1,
  },
  uploadCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadBox: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  uploadBoxDone: {
    borderColor: '#1E7A34',
    backgroundColor: '#E9F6EC',
    borderStyle: 'solid',
  },
  uploadTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },
  uploadStatus: {
    fontSize: 11,
    color: '#6B7280',
  },
  footer: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  skipStepButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  skipStepText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#4B5563',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  doLaterButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  doLaterText: {
    fontSize: 12,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
});
