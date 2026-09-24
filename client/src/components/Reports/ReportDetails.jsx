import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Chip, Divider, Grid, CardMedia, Button } from '@mui/material';
import {
  MapPin as LocationOnIcon,
  AlertTriangle as WarningIcon,
  CheckCircle2 as CheckCircleIcon,
  Clock as AccessTimeIcon,
  User as PersonIcon,
} from 'lucide-react';
import { styled } from '@mui/system';
import VerificationPanel from '../Verification/VerificationPanel';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: '1px solid rgb(var(--app-border))',
}));

const DetailItem = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center" mb={1}>
    {icon && <span className="mr-2 text-app-muted shrink-0 inline-flex">{icon}</span>}
    <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold', mr: 0.5, color: 'text.primary' }}>
      {label}:
    </Typography>
    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
      {value}
    </Typography>
  </Box>
);

DetailItem.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]).isRequired,
};

const ReportDetails = ({ report, onMarkReviewed, onMarkNeedsManualReview }) => {
  if (!report) {
    return <Typography>No report data available.</Typography>;
  }

  const { _id, location, waterLevel, severity, urgencyLevel, description, media, reportedBy, createdAt, verification, status } = report;

  const getSeverityColor = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const getVerificationStatusColor = (verificationStatus) => {
    switch (verificationStatus?.toLowerCase()) {
      case 'verified': return 'success';
      case 'not-matched': return 'error';
      case 'pending': return 'warning';
      default: return 'info';
    }
  };

  return (
    <StyledCard elevation={0}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Box mb={2}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                Flood Report #{_id ? _id.substring(0, 8) : 'N/A'}
              </Typography>
              <Chip
                label={(status || 'PENDING').toUpperCase()}
                color={status === 'reviewed' ? 'success' : 'info'}
                size="small"
                sx={{ mr: 1, fontWeight: 600 }}
              />
              {verification && (
                <Chip
                  label={`Verification: ${verification.status ? verification.status.replace(/-/g, ' ').toUpperCase() : 'N/A'}`}
                  color={getVerificationStatusColor(verification.status)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
              <Divider sx={{ my: 2 }} />
            </Box>

            <DetailItem icon={<LocationOnIcon className="w-4 h-4 text-primary-500" />} label="Location" value={location?.name || location?.address || 'N/A'} />
            <DetailItem icon={<WarningIcon className="w-4 h-4 text-amber-500" />} label="Severity" value={<Chip label={severity} color={getSeverityColor(severity)} size="small" />} />
            <DetailItem label="Urgency Level" value={urgencyLevel || 'Standard'} />
            <DetailItem label="Water Level" value={`${waterLevel || 0} feet`} />
            <DetailItem icon={<AccessTimeIcon className="w-4 h-4 text-app-muted" />} label="Reported At" value={new Date(createdAt).toLocaleString()} />

            <Box mt={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Description:</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{description || 'No description provided.'}</Typography>
            </Box>

            {reportedBy && (
              <Box mt={2} pt={2} borderTop="1px solid rgb(var(--app-border))">
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Reported By:</Typography>
                <DetailItem icon={<PersonIcon className="w-4 h-4 text-app-muted" />} label="Name" value={reportedBy.name || 'Anonymous'} />
                <DetailItem label="Email" value={reportedBy.email || 'N/A'} />
                <DetailItem label="Phone" value={reportedBy.phone || 'N/A'} />
                <DetailItem label="Trust Score" value={reportedBy.trustScore !== undefined ? reportedBy.trustScore : 'N/A'} />
              </Box>
            )}

            {media && media.length > 0 && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Attached Media</Typography>
                <Grid container spacing={2}>
                  {media.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <CardMedia
                        component="img"
                        image={typeof item === 'string' ? item : item.url}
                        alt={`Media ${index + 1}`}
                        sx={{
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: 2,
                          border: '1px solid rgb(var(--app-border))'
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Box mt={3} display="flex" gap={2}>
              {onMarkReviewed && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon className="w-4 h-4" />}
                  onClick={() => onMarkReviewed(_id)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Mark as Reviewed
                </Button>
              )}
              {onMarkNeedsManualReview && (
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<WarningIcon className="w-4 h-4" />}
                  onClick={() => onMarkNeedsManualReview(_id)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Needs Manual Review
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            {verification ? (
              <VerificationPanel verificationData={verification} />
            ) : (
              <Box p={3} border="1px dashed rgb(var(--app-border))" borderRadius={2} textAlign="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No AI verification data available for this report.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

ReportDetails.propTypes = {
  report: PropTypes.object,
  onMarkReviewed: PropTypes.func,
  onMarkNeedsManualReview: PropTypes.func,
};

export default ReportDetails;