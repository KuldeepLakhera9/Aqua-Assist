import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  HeartPulse as HospitalIcon,
  Home as ShelterIcon,
  Shield as PoliceIcon,
  Flame as FireStationIcon,
  MapPin as LocationIcon,
  Phone as PhoneIcon,
  ChevronDown as ExpandMoreIcon,
  AlertOctagon as EmergencyIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGeolocation } from "../../hooks/useGeolocation";
import emergencyServiceClient from "../../services/emergencyServiceClient";

// Helper component to display emergency contacts
const EmergencyContactCard = ({ contacts, onCallEmergency }) => {
  const { t } = useTranslation();

  return (
    <Card elevation={0} sx={{ mb: 3, border: "1px solid rgb(var(--app-border))", borderRadius: 2 }}>
      <Box sx={{ bgcolor: "error.main", color: "white", p: 2, display: "flex", alignItems: "center" }}>
        <EmergencyIcon className="w-5 h-5 mr-2 shrink-0" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t("emergency.emergencyContacts")}
        </Typography>
      </Box>
      <CardContent sx={{ bgcolor: "background.paper", p: 1 }}>
        <List dense>
          {contacts.map((contact, index) => (
            <ListItem
              key={index}
              sx={{
                py: 1,
                borderBottom: index < contacts.length - 1 ? "1px solid rgb(var(--app-border))" : "none"
              }}
              secondaryAction={
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => onCallEmergency(contact.number)}
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5 }}
                >
                  {t("emergency.call")}
                </Button>
              }
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {contact.type === "police" && <PoliceIcon className="w-4 h-4 text-blue-500" />}
                {contact.type === "fire" && <FireStationIcon className="w-4 h-4 text-rose-500" />}
                {(contact.type === "medical" || contact.type === "ambulance") && (
                  <HospitalIcon className="w-4 h-4 text-emerald-500" />
                )}
                {(contact.type === "disaster" || contact.type === "ndrf") && (
                  <EmergencyIcon className="w-4 h-4 text-amber-500" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>{contact.name}</Typography>}
                secondary={<Typography variant="caption" sx={{ color: "text.secondary" }}>{contact.number}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Helper component to display emergency resources
const EmergencyResourcesList = ({ resources, resourceType, title, icon }) => {
  const { t } = useTranslation();

  if (!resources || resources.length === 0) return null;

  return (
    <Accordion
      defaultExpanded={resourceType === "hospitals"}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        border: "1px solid rgb(var(--app-border))",
        mb: 1.5,
        borderRadius: "8px !important",
        "&:before": { display: "none" }
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon className="w-4 h-4" />}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {icon}
          <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 600 }}>
            {title} ({resources.length})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <List dense disablePadding>
          {resources.map((resource) => (
            <ListItem key={resource.id} sx={{ borderTop: "1px solid rgb(var(--app-border))", py: 1.5 }}>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                      {resource.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${resource.distance.toFixed(1)} km`}
                      color={resource.distance < 2 ? "success" : "default"}
                      variant="outlined"
                      sx={{ height: 22, fontSize: "0.7rem", fontWeight: 600 }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    {resource.address && (
                      <Typography
                        variant="caption"
                        sx={{ display: "flex", alignItems: "center", color: "text.secondary", mt: 0.25 }}
                      >
                        <LocationIcon className="w-3.5 h-3.5 mr-1 shrink-0" />
                        {resource.address}
                      </Typography>
                    )}
                    {resource.phone && (
                      <Typography
                        variant="caption"
                        sx={{ display: "flex", alignItems: "center", color: "text.secondary", mt: 0.25 }}
                      >
                        <PhoneIcon className="w-3.5 h-3.5 mr-1 shrink-0" />
                        {resource.phone}
                      </Typography>
                    )}
                    {resourceType === "hospitals" &&
                      resource.beds_available !== undefined && (
                        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mt: 0.25 }}>
                          {t("emergency.bedsAvailable")}:{" "}
                          <strong>{resource.beds_available}</strong>
                        </Typography>
                      )}
                    {resourceType === "shelters" &&
                      resource.available_space !== undefined && (
                        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mt: 0.25 }}>
                          {t("emergency.availableSpace")}:{" "}
                          <strong>{resource.available_space}/{resource.capacity}</strong>
                        </Typography>
                      )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

// Main emergency services component
const EmergencyServices = () => {
  const { t } = useTranslation();
  const { coordinates } = useGeolocation();

  const [contacts, setContacts] = useState([]);
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchEmergencyContacts = async () => {
      try {
        const contactsData =
          await emergencyServiceClient.getEmergencyContacts();
        setContacts(contactsData);
      } catch (err) {
        console.error("Error fetching emergency contacts:", err);
        setError(t("emergency.errorFetchingContacts"));
      }
    };

    fetchEmergencyContacts();
  }, [t]);

  useEffect(() => {
    const fetchEmergencyResources = async () => {
      if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
        return;
      }

      setLoading(true);
      try {
        const resourcesData =
          await emergencyServiceClient.getNearbyEmergencyResources(
            coordinates.longitude,
            coordinates.latitude,
            5000,
            ["hospital", "shelter", "police", "fire_station"]
          );
        setResources(resourcesData);
      } catch (err) {
        console.error("Error fetching emergency resources:", err);
        setError(t("emergency.errorFetchingResources"));
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyResources();
  }, [coordinates, t]);

  const handleCallEmergency = (phoneNumber) => {
    setSelectedContact(phoneNumber);
    setShowEmergencyDialog(true);
  };

  const handleConfirmCall = () => {
    if (selectedContact) {
      window.location.href = `tel:${selectedContact}`;
    }
    setShowEmergencyDialog(false);
  };

  const handleReportEmergency = async () => {
    if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
      setError(t("emergency.locationRequired"));
      return;
    }
    alert(t("emergency.reportEmergencyPrompt"));
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: "text.primary" }}>
        {t("emergency.emergencyServices")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="error"
        fullWidth
        size="large"
        startIcon={<EmergencyIcon className="w-5 h-5 mr-1" />}
        sx={{
          mb: 3,
          py: 1.5,
          fontSize: "1rem",
          fontWeight: 700,
          borderRadius: 2,
          textTransform: "none",
          boxShadow: "0 2px 8px rgba(225, 29, 72, 0.25)"
        }}
        onClick={handleReportEmergency}
      >
        {t("emergency.reportEmergency")}
      </Button>

      <EmergencyContactCard
        contacts={contacts}
        onCallEmergency={handleCallEmergency}
      />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: "text.primary", mt: 3 }}>
        {t("emergency.nearbyResources")}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <>
          {!resources.hospitals &&
          !resources.shelters &&
          !resources.police_stations &&
          !resources.fire_stations ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>{t("emergency.noResourcesFound")}</Alert>
          ) : (
            <Box>
              <EmergencyResourcesList
                resources={resources.hospitals}
                resourceType="hospitals"
                title={t("emergency.hospitals")}
                icon={<HospitalIcon className="w-4 h-4 text-emerald-500" />}
              />

              <EmergencyResourcesList
                resources={resources.shelters}
                resourceType="shelters"
                title={t("emergency.shelters")}
                icon={<ShelterIcon className="w-4 h-4 text-sky-500" />}
              />

              <EmergencyResourcesList
                resources={resources.police_stations}
                resourceType="police"
                title={t("emergency.policeStations")}
                icon={<PoliceIcon className="w-4 h-4 text-indigo-500" />}
              />

              <EmergencyResourcesList
                resources={resources.fire_stations}
                resourceType="fire"
                title={t("emergency.fireStations")}
                icon={<FireStationIcon className="w-4 h-4 text-rose-500" />}
              />
            </Box>
          )}
        </>
      )}

      <Dialog
        open={showEmergencyDialog}
        onClose={() => setShowEmergencyDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "background.paper",
            backgroundImage: "none",
            border: "1px solid rgb(var(--app-border))"
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: "error.main", color: "white", fontWeight: 700 }}>
          {t("emergency.emergencyCall")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, mt: 1 }}>
          <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
            {t("emergency.confirmEmergencyCall")} <strong>{selectedContact}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5, color: "text.secondary" }}>
            {t("emergency.onlyUseForEmergencies")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowEmergencyDialog(false)} sx={{ color: "text.secondary" }}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCall}
            autoFocus
            sx={{ fontWeight: 600, borderRadius: 1.5 }}
          >
            {t("emergency.callNow")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmergencyServices;
