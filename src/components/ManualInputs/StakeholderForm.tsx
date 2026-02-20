import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon
} from '@mui/icons-material';

interface ManualInputs {
  call_center_escalations: string;
  logistics_issues: string;
  grassroot_updates: string;
  brewery_discussion_points: string;
  payment_exceptions: string;
  general_notes: string;
}

interface StakeholderFormProps {
  onSave?: (inputs: ManualInputs) => void;
  onGenerateReport?: (inputs: ManualInputs) => void;
  initialData?: Partial<ManualInputs>;
}

const StakeholderForm: React.FC<StakeholderFormProps> = ({
  onSave,
  onGenerateReport,
  initialData = {}
}) => {
  const [inputs, setInputs] = useState<ManualInputs>({
    call_center_escalations: '',
    logistics_issues: '',
    grassroot_updates: '',
    brewery_discussion_points: '',
    payment_exceptions: '',
    general_notes: '',
    ...initialData
  });

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [autoSaveEnabled] = useState(true);



  const handleInputChange = (field: keyof ManualInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateInputs = useCallback((): string[] => {
    const errors: string[] = [];

    // Check for minimum content requirements
    const minLengths = {
      call_center_escalations: 10,
      logistics_issues: 10,
      grassroot_updates: 10,
      brewery_discussion_points: 15,
      payment_exceptions: 10,
      general_notes: 5
    };

    Object.entries(minLengths).forEach(([field, minLength]) => {
      const value = inputs[field as keyof ManualInputs].trim();
      if (value.length > 0 && value.length < minLength) {
        errors.push(`${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} should be at least ${minLength} characters if provided.`);
      }
    });

    return errors;
  }, [inputs]);

  const handleSave = useCallback(async (silent = false) => {
    const errors = validateInputs();
    if (errors.length > 0 && !silent) {
      setValidationErrors(errors);
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onSave) {
        onSave(inputs);
      }

      setLastSaved(new Date());
      if (!silent) {
        // Show success message
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  }, [inputs, onSave, validateInputs]);

  const handleGenerateReport = () => {
    const errors = validateInputs();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (onGenerateReport) {
      onGenerateReport(inputs);
    }
  };

  const getCharacterCount = (field: keyof ManualInputs): number => {
    return inputs[field].length;
  };

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const timer = setTimeout(async () => {
      // Only auto-save if there are changes and at least one field has content
      const hasContent = Object.values(inputs).some(value => value.trim().length > 0);
      const hasChanges = JSON.stringify(inputs) !== JSON.stringify(initialData);

      if (hasContent && hasChanges) {
        await handleSave(true); // Silent save
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timer);
  }, [inputs, autoSaveEnabled, handleSave, initialData]);

  const getWordCount = (field: keyof ManualInputs): number => {
    return inputs[field].trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <Box>
      {/* Header with save status */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Daily Stakeholder Inputs
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {lastSaved && (
              <Chip
                icon={<CheckCircleIcon />}
                label={`Last saved: ${lastSaved.toLocaleTimeString()}`}
                color="success"
                size="small"
              />
            )}
            {saving && (
              <Chip
                icon={<ScheduleIcon />}
                label="Saving..."
                color="warning"
                size="small"
              />
            )}
          </Box>
        </Box>
      </Paper>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Please fix the following issues:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Form Sections */}
      {/* Form Sections */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Call Center Escalations */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              📞 Call Center Escalations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Document any customer escalations, urgent issues, or special cases handled today.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Example: Case #2025001040: Customer requesting immediate refund (High priority) due to product quality issues..."
              value={inputs.call_center_escalations}
              onChange={(e) => handleInputChange('call_center_escalations', e.target.value)}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {getCharacterCount('call_center_escalations')} characters, {getWordCount('call_center_escalations')} words
              </Typography>
              {inputs.call_center_escalations.trim() && (
                <Chip label="Ready" color="success" size="small" />
              )}
            </Box>
          </Paper>
        </Box>

        {/* Logistics Issues */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              🚚 Logistics Issues
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Report any sample pickup delays, delivery issues, or logistics exceptions encountered today.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Example: Region Vijayawada: 3 pickups failed due to incorrect address format in portal..."
              value={inputs.logistics_issues}
              onChange={(e) => handleInputChange('logistics_issues', e.target.value)}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {getCharacterCount('logistics_issues')} characters, {getWordCount('logistics_issues')} words
              </Typography>
              {inputs.logistics_issues.trim() && (
                <Chip label="Ready" color="success" size="small" />
              )}
            </Box>
          </Paper>
        </Box>

        {/* Grassroot Updates */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              🌱 Grassroot Updates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share progress on portal requirements, enhancement requests, or vendor coordination updates.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Example: High priority feature X completed. Testing in progress with vendor team..."
              value={inputs.grassroot_updates}
              onChange={(e) => handleInputChange('grassroot_updates', e.target.value)}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {getCharacterCount('grassroot_updates')} characters, {getWordCount('grassroot_updates')} words
              </Typography>
              {inputs.grassroot_updates.trim() && (
                <Chip label="Ready" color="success" size="small" />
              )}
            </Box>
          </Paper>
        </Box>

        {/* Brewery Discussion Points */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              🏭 Brewery Discussion Points
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Prepare talking points for brewery cadence calls, RCA reviews, or quality discussions.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Example: Pattern observed: 60% unjustified in Primary Packaging are actually valid quality issues. Recommend enhanced inspection protocols..."
              value={inputs.brewery_discussion_points}
              onChange={(e) => handleInputChange('brewery_discussion_points', e.target.value)}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {getCharacterCount('brewery_discussion_points')} characters, {getWordCount('brewery_discussion_points')} words
              </Typography>
              {inputs.brewery_discussion_points.trim() && (
                <Chip label="Ready" color="success" size="small" />
              )}
            </Box>
          </Paper>
        </Box>

        {/* Payment Exceptions */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              💰 Payment Exceptions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Document any settlement approvals, payment processing issues, or financial exceptions.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Example: Settlement #2025001040 (₹15,000) requires CFO approval due to high value..."
              value={inputs.payment_exceptions}
              onChange={(e) => handleInputChange('payment_exceptions', e.target.value)}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {getCharacterCount('payment_exceptions')} characters, {getWordCount('payment_exceptions')} words
              </Typography>
              {inputs.payment_exceptions.trim() && (
                <Chip label="Ready" color="success" size="small" />
              )}
            </Box>
          </Paper>
        </Box>

        {/* General Notes */}
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              📝 General Notes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Any additional context, observations, or notes for the daily brief.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Example: Holiday tomorrow - expect lower processing volume. Team meeting at 2 PM to discuss Q1 goals..."
              value={inputs.general_notes}
              onChange={(e) => handleInputChange('general_notes', e.target.value)}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {getCharacterCount('general_notes')} characters, {getWordCount('general_notes')} words
              </Typography>
              {inputs.general_notes.trim() && (
                <Chip label="Ready" color="success" size="small" />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={() => handleSave()}
            disabled={saving}
            size="large"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>

          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleGenerateReport}
            disabled={saving}
            size="large"
            color="primary"
          >
            🤖 Generate Report
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          Auto-save enabled • All inputs are validated before report generation
        </Typography>
      </Paper>
    </Box>
  );
};

export default StakeholderForm;