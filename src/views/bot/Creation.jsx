import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactTooltip from "react-tooltip";

import AtomicBot from "../../models/Bot/AtomicBot";
import Perception from "../../models/Bot/Perception";
import InnerState from "../../models/Bot/InnerState";
import Action from "../../models/Bot/Action";

import CodeMode from "./CodeMode.jsx";

// style
import "./style.scss";
import YesNotDialog, {
  DialogTypesEnum,
} from "../../components/Dialog/YesNotDialog/YesNotDialog";

const Creation = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // states
  const [showDialog, setShowDialog] = useState(false);
  // links
  const [eps, setEps] = useState([]); // environment state - perception
  const [ipis, setIpis] = useState([]); // inner state - perception - inner state
  const [ias, setIas] = useState([]); // innert state - action

  // environment state - perception
  const [ep, setEp] = useState("");
  const [pe, setPe] = useState("");

  // inner state - perception - inner state
  const [ipi, setIpi] = useState("");
  const [pii, setPii] = useState("");
  const [iip, setIip] = useState("");

  // innert state - action
  const [ia, setIa] = useState("");
  const [ai, setAi] = useState("");

  // strings
  const [environmentStatesString, setEnvironmentStatesString] = useState([]);
  const [perceptionsString, setPerceptionsString] = useState([]);
  const [innerStatesString, setInnerStatesString] = useState([]);
  const [actionsString, setActionsString] = useState([]);

  // arrays
  const [environmentStatesArray, setEnvironmentStatesArray] = useState([]);
  const [perceptionsArray, setPerceptionsArray] = useState([]);
  const [innerStatesArray, setInnerStatesArray] = useState([]);
  const [actionsArray, setActionsArray] = useState([]);

  // !errors
  const [environmentStatesError, setEnvironmentStatesError] = useState(
    errors[0]
  );
  const [perceptionsError, setPerceptionsError] = useState(errors[0]);
  const [innerStatesError, setInnerStatesError] = useState(errors[0]);
  const [actionsError, setActionsError] = useState(errors[0]);

  const E = ["Nada", "Mineral"]; // environment states
  const P = [
    new Perception("Nada", "Nada"),
    new Perception("Mineral", "Mineral"),
  ]; // perceptions
  const I = [new InnerState("Buscando"), new InnerState("Recogiendo")]; // inner states
  const A = [
    new Action("Buscando", "Buscar"),
    new Action("Recogiendo", "Recoger"),
  ]; // actions
  const links = {
    Buscando: {
      Nada: {
        next: "Buscando",
      },
    },
    Recogiendo: {
      Mineral: {
        next: "Recogiendo",
      },
    },
  };
  const initial = { i: I[0] };

  const errorsList = [
    "Campo requerido",
    "Estructura incorrecta, escribe palabras separadas por coma, no se admiten números",
  ];

  const tooltipsList = [
    "Estados posibles que ocurren en el ambiente",
    "Percepciones del bot a la hora de encontrarse con un estado del ambiente",
    "Estados internos del bot que indican que está haciendo",
    "Acciones que realiza el bot dependiendo de su estado interno",
    "Función see(Ei) => Pj. Dado un estado del ambiente se obtiene una percepción",
    "Función next(Ei, Pj) => Pw. Dado un estado interno y una percepción se optiene el próximo estado interno",
    "Función action(Ei) => Aj. Dado un estado interno se obtiene una acción",
  ];

  const MyBot = new AtomicBot(E, P, I, A, links, initial);

  useEffect(() => {}, []);

  const onSubmit = (data) => {};

  const acceptDialog = () => {};

  const cancelDialog = () => {
    setShowDialog(false);
  };

  const validateInput = (input) => {
    if (input.length > 0) {
      if (input.match(/^([A-Za-z ]+,*)+$/) === null) return errorsList[1];
      else return "";
    }
    return errorsList[0];
  };

  const turnToArray = (input) => {
    const splitted = input.split(",");
    return splitted;
  };

  // watch bot parameters
  watch((item) => {
    const { environmentStates, perceptions, innerStates, actions } = item;

    if (
      environmentStates !== environmentStatesString &&
      environmentStates !== ""
    ) {
      setEnvironmentStatesString(environmentStates);
      setEnvironmentStatesError(validateInput(environmentStates));
      setEnvironmentStatesArray(turnToArray(environmentStates));
    }

    if (perceptions !== perceptionsString && perceptions !== "") {
      setPerceptionsString(perceptions);
      setPerceptionsError(validateInput(perceptions));
      setPerceptionsArray(turnToArray(perceptions));
    }

    if (innerStates !== innerStatesString && innerStates !== "") {
      setInnerStatesString(innerStates);
      setInnerStatesError(validateInput(innerStates));
      setInnerStatesArray(turnToArray(innerStates));
    }

    if (actions !== actionsString && actions !== "") {
      setActionsString(actions);
      setActionsError(validateInput(actions));
      setActionsArray(turnToArray(actions));
    }
  });

  const clickEPLinkerButton = (e) => {
    console.log(eps);
    // kio = das; //desenlanzando e - p existente
    if (e.target.classList.contains("un-linked")) {
      e.target.classList.remove("un-linked");
      e.target.classList.add("selected");
    } else {
      e.target.classList.add("un-linked");
      e.target.classList.remove("selected");
    }

    const { id } = e.target;
    if (id.indexOf("ep") === 0) {
      if (ep !== "") {
        // unselecting previous button
        document.getElementById(ep).classList.add("un-linked");
        document.getElementById(ep).classList.remove("selected");
      }
      // will be linked
      else if (pe !== "") {
        // if there is a previous link
        // searching by ep
        let exist = eps.filter((item) => {
          if (item.e === id) {
            return item;
          }
        });
        if (exist.length > 0) {
          setShowDialog(true);
        } else {
          // marking as previous linked button
          document.getElementById(pe).classList.remove("selected");
          document.getElementById(pe).classList.add("linked");
          // marking as linked current button
          e.target.classList.remove("selected");
          e.target.classList.add("linked");
          // saving references
          const newEps = eps;
          newEps.push({ e: id, p: pe });
          setEp("");
          setPe("");
          setEps(newEps);
        }
        return;
      }
      setEp(id);
    }
    if (id.indexOf("pe") === 0) {
      if (pe !== "") {
        // unselecting previous button
        document.getElementById(pe).classList.add("un-linked");
        document.getElementById(pe).classList.remove("selected");
      }
      // will be linked
      else if (ep !== "") {
        // marking as previous linked button
        document.getElementById(ep).classList.remove("selected");
        document.getElementById(ep).classList.add("linked");
        // marking as linked current button
        e.target.classList.remove("selected");
        e.target.classList.add("linked");
        // saving references
        const newEps = eps;
        newEps.push({ e: ep, p: id });
        // removing references
        setEp("");
        setPe("");
        setEps(newEps);
        return;
      }
      setPe(id);
    }
  };

  const createSee = () => {

  }

  const createNext =() => {

  }

  const createAction = () => {

  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <YesNotDialog
        type={DialogTypesEnum.Warning}
        text={
          "Estás seguro de anular el enlace del estado del ambiente seleccionado"
        }
        accept={"Aceptar"}
        cancel={"Cancelar"}
        onAccept={acceptDialog}
        onCancel={cancelDialog}
        visible={showDialog}
      />
      <CreationDialog />
      <div>
        <form className="creation-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card" style={{ width: 350 }}>
            <h3>Define los parámetros del bot</h3>
            <div className="form-input">
              <div className="form-legend">
                <label htmlFor="environmentStates">Estados del ambiente:</label>
              </div>
              <input
                id="environmentStates"
                type="text"
                {...register("environmentStates", {
                  required: true,
                  pattern: /^([A-Za-z ]+,*)+$/,
                })}
              />
              <span className="tooltip-trigger" data-tip={tooltipsList[0]}>
                ?
              </span>
            </div>
            <span className="error-span">{environmentStatesError}</span>
            <div className="form-input">
              <div className="form-legend">
                <label htmlFor="perceptions">Percepciones:</label>
              </div>
              <input
                id="perceptions"
                type="text"
                {...register("perceptions", {
                  required: true,
                  pattern: /^([A-Za-z ]+,*)+$/,
                })}
              />
              <span className="tooltip-trigger" data-tip={tooltipsList[1]}>
                ?
              </span>
            </div>
            <span className="error-span">{perceptionsError}</span>
            <div className="form-input">
              <div className="form-legend">
                <label htmlFor="innerStates">Estados internos:</label>
              </div>
              <input
                id="innerStates"
                type="text"
                {...register("innerStates", {
                  required: true,
                  pattern: /^([A-Za-z ]+,*)+$/,
                })}
              />
              <span className="tooltip-trigger" data-tip={tooltipsList[2]}>
                ?
              </span>
            </div>
            <span className="error-span">{innerStatesError}</span>
            <div className="form-input">
              <div className="form-legend">
                <label htmlFor="actions">Acciones:</label>
              </div>
              <input
                id="actions"
                type="text"
                {...register("actions", {
                  required: true,
                  pattern: /^([A-Za-z ]+,*)+$/,
                })}
              />
              <span className="tooltip-trigger" data-tip={tooltipsList[3]}>
                ?
              </span>
            </div>
            <span className="error-span">{actionsError}</span>
          </div>
          <div className="form-card" style={{width: 450}}>
            <div>
              <h3>Enlaza percepciones con estados del ambiente</h3>
              <div className="flex-column">
                <div>
                  Estados del ambiente
                  <ul>
                    {environmentStatesArray.map((item, i) => {
                      return (
                        <li key={`eS${i}`}>
                          <button
                            type="button"
                            id={`ep${i}`}
                            className="ease-transition list-toggle-button un-linked"
                          >
                            {item}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  Percepciones
                  <ul>
                    {perceptionsArray.map((item, i) => {
                      return (
                        <li key={`eS${i}`}>
                          <button
                            type="button"
                            id={`pe${i}`}
                            className="ease-transition list-toggle-button un-linked"
                          >
                            {item}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  Estados internos
                  <ul>
                    {innerStatesArray.map((item, i) => {
                      return (
                        <li key={`eS${i}`}>
                          <button
                            type="button"
                            id={`ipi${i}`}
                            className="ease-transition list-toggle-button un-linked"
                          >
                            {item}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  Acción
                  <ul>
                    {actionsArray.map((item, i) => {
                      return (
                        <li key={`eS${i}`}>
                          <button
                            type="button"
                            id={`ai${i}`}
                            className="ease-transition list-toggle-button un-linked"
                          >
                            {item}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex align-center">
              <h3>Función see(Ei) => Pj</h3>
              <button type="button" className="button alter-ghost ghost small-margin" onClick={createSee}>Add</button>
              <span className="tooltip-trigger" data-tip={tooltipsList[4]}>
                ?
              </span>
            </div>
            <div className="flex align-center">
              <h3>Función next(Pj, Ei) => Ew</h3>
              <button type="button" className="button alter-ghost ghost small-margin" onClick={createNext}>Add</button>
              <span className="tooltip-trigger" data-tip={tooltipsList[5]}>
                ?
              </span>
            </div>
            <div className="flex align-center">
              <h3>Función action(Ei) => Aj</h3>
              <button type="button" className="button alter-ghost ghost small-margin" onClick={createAction}>Add</button>
              <span className="tooltip-trigger" data-tip={tooltipsList[6]}>
                ?
              </span>
            </div>
          </div>
          {/*
          <div className="form-card">
            <h3>Define las relaciones</h3>
            <CodeMode />
          </div>
          */}
        </form>
        <ReactTooltip />
        <input type="submit" className="button primary ease-transition" />
      </div>
    </div>
  );
};

export default Creation;
