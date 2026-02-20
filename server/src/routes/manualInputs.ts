import express from 'express';
import { saveManualInputs, getManualInputs, validateManualInputs } from '../services/manualInputsService';

const router = express.Router();

// Interface for manual inputs
interface ManualInputs {
  call_center_escalations: string;
  logistics_issues: string;
  grassroot_updates: string;
  brewery_discussion_points: string;
  payment_exceptions: string;
  general_notes: string;
}

// Save manual inputs
router.post('/', async (req, res) => {
  try {
    const inputs: ManualInputs = req.body;

    // Validate inputs
    const validation = validateManualInputs(inputs);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Save inputs (in real implementation, save to database)
    const result = await saveManualInputs(inputs, req.user?.id || 'anonymous');

    res.json({
      success: true,
      data: result,
      message: 'Manual inputs saved successfully'
    });

  } catch (error) {
    console.error('Save manual inputs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save manual inputs'
    });
  }
});

// Get manual inputs for today
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const inputs = await getManualInputs(today, req.user?.id || 'anonymous');

    res.json({
      success: true,
      data: inputs || getEmptyInputs()
    });

  } catch (error) {
    console.error('Get manual inputs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve manual inputs'
    });
  }
});

// Get manual inputs history
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 7; // Last 7 days by default
    const history = await getManualInputsHistory(req.user?.id || 'anonymous', limit);

    res.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Get manual inputs history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve inputs history'
    });
  }
});

// Validate inputs without saving
router.post('/validate', (req, res) => {
  try {
    const inputs: ManualInputs = req.body;
    const validation = validateManualInputs(inputs);

    res.json({
      success: true,
      valid: validation.valid,
      errors: validation.errors,
      suggestions: validation.suggestions
    });

  } catch (error) {
    console.error('Validate inputs error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed'
    });
  }
});

// Get input templates/suggestions
router.get('/templates', (req, res) => {
  const templates = {
    call_center_escalations: {
      placeholder: "Case #2025001040: Customer requesting immediate refund (High priority)",
      examples: [
        "Multiple customers reporting similar quality issues in Region X",
        "Customer escalation due to delayed response on Case #12345",
        "VIP customer requesting special handling for urgent complaint"
      ]
    },
    logistics_issues: {
      placeholder: "Region Vijayawada: 3 pickups failed due to incorrect address format",
      examples: [
        "Logistics partner experiencing delays in Region Y",
        "Multiple address validation failures in portal",
        "Sample collection TAT exceeded for high-priority cases"
      ]
    },
    grassroot_updates: {
      placeholder: "High priority feature X completed. Testing in progress with vendor team",
      examples: [
        "Portal enhancement request approved and scheduled for next sprint",
        "Vendor coordination meeting held - positive feedback received",
        "New requirement identified for bulk data import functionality"
      ]
    },
    brewery_discussion_points: {
      placeholder: "Pattern observed: 60% unjustified in Primary Packaging are valid quality issues",
      examples: [
        "Unjustified cases showing consistent patterns - recommend process review",
        "RCA completion rate improved 15% - positive trend continues",
        "Quality inspection protocols need enhancement based on recent findings"
      ]
    },
    payment_exceptions: {
      placeholder: "Settlement #2025001040 (₹15,000) requires CFO approval due to high value",
      examples: [
        "High-value settlement pending executive approval",
        "Payment processing delayed due to bank integration issues",
        "Exception approval required for out-of-policy settlement terms"
      ]
    },
    general_notes: {
      placeholder: "Holiday tomorrow - expect lower processing volume",
      examples: [
        "Team meeting scheduled for 2 PM to discuss process improvements",
        "System maintenance window tonight from 10 PM to 12 AM",
        "New team member onboarding - expect temporary capacity reduction"
      ]
    }
  };

  res.json({
    success: true,
    templates
  });
});

function getEmptyInputs(): ManualInputs {
  return {
    call_center_escalations: '',
    logistics_issues: '',
    grassroot_updates: '',
    brewery_discussion_points: '',
    payment_exceptions: '',
    general_notes: ''
  };
}

export default router;