import {
  Backdrop, Fade, makeStyles, Modal, Grid, Button,
  FormControl, InputLabel, Select, MenuItem, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import {
  getShorthandByObsPeriod, deleteShorthand, deleteObservations, deleteObservationperiod
} from "../../services";
import {
  loopThroughObservationPeriods, loopThroughObservations, setDayId
} from "../homePage/parseShorthandField";
import CodeMirrorBlock from "../../globalComponents/codemirror/CodeMirrorBlock";
import ErrorPaper from "../../globalComponents/codemirror/ErrorPaper";


const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  paper: {
    backgroundColor: "white",
    height: "85%",
    width: "85%",
    padding: theme.spacing(2, 4, 3),
    overflowY: "scroll",
    overflowX: "hidden",
  },
  errorPaper: {
    background: "#f5f890",
    padding: "20px 30px",
    marginTop: "10px",
    maxHeight: "8vw",
    overflow: "auto",
  },
  errorHeading: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  root: {
    "& .MuiFormControl-root": {
      width: "70%",
      margin: "1em"
    }
  },
}));


const EditObsPeriod = ({ date, obsPeriod, open, handleClose }) => {

  const [defaultShorthand, setDefaultShorthand] = useState([]);
  const [shorthand, setShorthand] = useState("");
  const [codeMirrorHasErrors, setCodeMirrorHasErrors] = useState(false);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [warning, setWarning] = useState(false);
  const [sanitizedShorthand, setSanitizedShorthand] = useState("");
  const userID = useSelector(state => state.user.id);

  const userObservatory = useSelector(state => state.userObservatory);
  const stations = useSelector(state => state.stations);

  const initializeDefaultShorthand = (shorthandblocks) => {
    setDefaultShorthand(shorthandblocks);
    let text = obsPeriod.startTime + "\n";
    for (const block of shorthandblocks) {
      text += block.shorthandBlock;
      text += "\n";
    }
    text += obsPeriod.endTime + "\n";
    setShorthand(text);
  };

  const handleDialogOpen = () => {
    setWarning(true);
  };

  const handleDialogClose = () => {
    setWarning(false);
  };

  const handleDialogConfirm = () => {
    setWarning(false);
    handleDelete();
  };

  const deleteButtonIsDisabled = () => {
    if (shorthand.replace(/(\r\n|\n|\r)/gm, "").trim() === "" || location === "" || type === "") {
      return true;
    } else {
      return false;
    }
  };

  const handleDelete = async () => {
    for (const block of defaultShorthand) {
      console.log("Deleted shorthandblock", block.id);
      await deleteObservations({ shorthand_id: Number(block.id) });
      await deleteShorthand({ shorthand_id: Number(block.id) });
    }
    console.log("Deleted observationperiod", obsPeriod.id);
    await deleteObservationperiod({ obsperiod_id: Number(obsPeriod.id) });
    setDefaultShorthand("");
    handleClose();
  };


  const handleSave = async () => {
    await handleDelete();
    setDayId(obsPeriod.day_id);
    const rows = sanitizedShorthand;
    await loopThroughObservationPeriods(rows, type, location);
    await loopThroughObservations(rows, userID);
    handleClose();
  };


  useEffect(async () => {
    if (obsPeriod.id) {
      setType(obsPeriod.observationType);
      setLocation(obsPeriod.location);
      const shorthand = await getShorthandByObsPeriod(obsPeriod.id);
      initializeDefaultShorthand(shorthand);
    }
  }, [obsPeriod]);


  useEffect(() => {
    if (Object.keys(userObservatory).length !== 0) {
      setTypes(
        stations
          .find(s => s.observatory === userObservatory)
          .types
      );
    }
  });

  useEffect(() => {
    if (Object.keys(userObservatory).length !== 0) {
      setLocations(
        stations
          .find(s => s.observatory === userObservatory)
          .locations
      );
    }
  });

  const { t } = useTranslation();

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  const classes = useStyles();

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      disableAutoFocus={true}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2> {t("editShorthand")} </h2>
          <h3> {t("Observation period")} {date} {t("at")} {obsPeriod.startTime} - {obsPeriod.endTime} </h3>
          <Grid
            container
            height="100%"
            alignItems="flex-start"
            spacing={1}>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <InputLabel id="Tyyppi">{t("type")}</InputLabel>
                <Select required
                  labelId="type"
                  fullWidth={true}
                  id="selectTypeInModification"
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value);
                  }}
                >
                  {
                    types.map((type, i) =>
                      <MenuItem id={type} value={type} key={i}>
                        {type}
                      </MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <InputLabel id="Location">{t("location")}</InputLabel>
                <Select required
                  labelId="location"
                  id="selectLocationInModification"
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value);
                  }}
                >
                  {
                    locations.map((location, i) =>
                      <MenuItem id={location} value={location} key={i}>
                        {location}
                      </MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <CodeMirrorBlock
                setCodeMirrorHasErrors={setCodeMirrorHasErrors}
                setSanitizedShorthand={setSanitizedShorthand}
                setShorthand={setShorthand}
                shorthand={shorthand}
              />
            </Grid>
            <Grid item xs={12}>
              <ErrorPaper codeMirrorHasErrors={codeMirrorHasErrors} />
            </Grid>
            <Grid container item xs={12} alignItems="flex-end">
              <Box pr={2} pt={2}>
                <Button
                  id="saveButtonInShorthandModification"
                  disabled={codeMirrorHasErrors || !shorthand.trim()}
                  variant="contained"
                  color="primary"
                  onClick={handleSave}>
                  {t("save")}
                </Button>
              </Box>
              <Box pr={2} pt={2}>
                <Button
                  id="cancelButtonInShorthandModification"
                  variant="contained"
                  color="primary"
                  onClick={handleClose}>
                  {t("cancel")}
                </Button>
              </Box>
              <Box pr={2} pt={2}>
                <Button
                  id="removeButtonInShorthandModification"
                  disabled={deleteButtonIsDisabled()}
                  variant="contained"
                  color="secondary"
                  onClick={handleDialogOpen}>
                  {t("remove")}
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Dialog
            open={warning}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{t("Confirm deletion")}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("removingCannotBeCancelled")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogConfirm} color="secondary" id="confirmButton">
                {t("confirm")}
              </Button>
              <Button onClick={handleDialogClose} color="default" id="cancelButton" autoFocus>
                {t("cancel")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Fade>
    </Modal>
  );
};

EditObsPeriod.propTypes = {
  date: PropTypes.string.isRequired,
  obsPeriod: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditObsPeriod;