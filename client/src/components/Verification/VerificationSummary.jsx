import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  LinearProgress,
  Tooltip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  CheckCircle2 as CheckIcon,
  AlertCircle as ErrorIcon,
  Cloud as CloudIcon,
  Newspaper as NewsIcon,
  Camera as InstagramIcon,
  HelpCircle as UnknownIcon,
  Cpu as AIIcon,
} from "lucide-react";

const VerificationSummary = ({ verificationData }) => {
  const theme = useTheme();

  if (!verificationData) {
    return (
      <Card>
        <CardContent>
          <Typography>No verification data available.</Typography>
        </CardContent>
      </Card>
    );
  }

  const { status, summary, confidence, weather, news, social } =
    verificationData;

  // Confidence as percentage
  const confidencePercent =
    typeof confidence === "number" ? Math.round(confidence * 100) : 0;

  // Helper to get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
      case "matched":
        return "success";
      case "partially-verified":
      case "partially-matched":
        return "info";
      case "not-matched":
        return "error";
      case "manual-review":
      case "pending":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  // Helper to get icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
      case "matched":
        return <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />;
      case "not-matched":
      case "error":
        return <ErrorIcon className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <UnknownIcon className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", fontWeight: 700 }}
          >
            <AIIcon className="w-5 h-5 mr-2 text-primary-600 dark:text-sky-400 inline-block shrink-0" />
            AI Verification Results
          </Typography>
          <Chip
            label={status ? status.replace(/-/g, " ").toUpperCase() : "PENDING"}
            color={getStatusColor(status)}
            size="small"
            icon={getStatusIcon(status)}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {summary || "Verification in progress..."}
        </Typography>

        {/* Confidence Score */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Confidence Score</Typography>
            <Typography variant="body2" fontWeight="bold">
              {confidencePercent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={confidencePercent}
            sx={{
              mt: 1,
              height: 8,
              borderRadius: 1,
              bgcolor: "divider",
              "& .MuiLinearProgress-bar": {
                bgcolor:
                  confidencePercent >= 80
                    ? theme.palette.success.main
                    : confidencePercent >= 50
                    ? theme.palette.warning.main
                    : theme.palette.error.main,
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Data Sources */}
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Verification Sources
        </Typography>

        <Grid container spacing={2}>
          {/* Weather Verification */}
          <Grid item xs={12} md={4}>
            <Tooltip title={weather?.summary || "No weather data"}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CloudIcon className="w-4 h-4 mr-2 text-sky-500 inline-block shrink-0" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Weather Data</Typography>
                  </Box>
                  <Chip
                    label={
                      weather?.status
                        ? weather.status.replace(/-/g, " ").toUpperCase()
                        : "N/A"
                    }
                    size="small"
                    color={getStatusColor(weather?.status)}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>

          {/* News Verification */}
          <Grid item xs={12} md={4}>
            <Tooltip title={news?.summary || "No news data"}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <NewsIcon className="w-4 h-4 mr-2 text-indigo-500 inline-block shrink-0" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>News Articles</Typography>
                  </Box>
                  <Chip
                    label={
                      news?.status
                        ? news.status.replace(/-/g, " ").toUpperCase()
                        : "N/A"
                    }
                    size="small"
                    color={getStatusColor(news?.status)}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>

          {/* Social Media Verification */}
          <Grid item xs={12} md={4}>
            <Tooltip title={social?.summary || "No social media data"}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <InstagramIcon className="w-4 h-4 mr-2 text-pink-500 inline-block shrink-0" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Social Media</Typography>
                  </Box>
                  <Chip
                    label={
                      social?.status
                        ? social.status.replace(/-/g, " ").toUpperCase()
                        : "COMING SOON"
                    }
                    size="small"
                    color={getStatusColor(social?.status)}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>
        </Grid>

        {/* Decision Factors */}
        {summary && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Key Verification Factors
            </Typography>
            <List dense>
              {weather && weather.status === "matched" && (
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      weather.summary || "Weather data confirms flooding"
                    }
                  />
                </ListItem>
              )}
              {weather && weather.status === "not-matched" && (
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ErrorIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      weather.summary ||
                      "Weather data does not indicate flooding"
                    }
                  />
                </ListItem>
              )}
              {news && news.status === "matched" && (
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={news.summary || "News articles confirm flooding"}
                  />
                </ListItem>
              )}
              {news && news.status === "not-matched" && (
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ErrorIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={news.summary || "No relevant news articles found"}
                  />
                </ListItem>
              )}
              {social && social.status === "matched" && (
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={social.summary || "Social media confirms flooding"}
                  />
                </ListItem>
              )}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};

VerificationSummary.propTypes = {
  verificationData: PropTypes.shape({
    status: PropTypes.string,
    summary: PropTypes.string,
    confidence: PropTypes.number,
    weather: PropTypes.shape({
      status: PropTypes.string,
      summary: PropTypes.string,
    }),
    news: PropTypes.shape({
      status: PropTypes.string,
      summary: PropTypes.string,
    }),
    social: PropTypes.shape({
      status: PropTypes.string,
      summary: PropTypes.string,
    }),
  }),
};

export default VerificationSummary;
