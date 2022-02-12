import React, { useEffect, useState } from "react";
import { Checkbox, Dropdown, Grid, Form, Input } from "semantic-ui-react";
import { transformerFunctions } from "../lib/transformers/transformerFunctions";

const [NAMEWIDTH, TRANSFORMERWIDTH] = [5, 11];

const options = Object.keys(transformerFunctions).map((key) => ({
  key,
  value: key,
  text: transformerFunctions[key].label,
}));

const CreateTransformers = ({ recipe, setRecipe }) => {
  useEffect(() => {
    const transformers = recipe.transformers || [];
    const notEmpty = (transformer) => transformer.name !== "";
    const newtransformers = transformers.filter(notEmpty);
    newtransformers.push({ name: "", transformer: null });
    if (
      newtransformers.length === transformers.length &&
      !notEmpty(transformers[transformers.length - 1])
    )
      return;
    setRecipe((recipe) => ({ ...recipe, transformers: newtransformers }));
  }, [recipe.transformers, setRecipe]);

  if (!recipe.transformers) return null;
  return (
    <Grid style={{ paddingBottom: "30px" }}>
      <Grid.Row style={{ paddingBottom: "0" }}>
        <Grid.Column width={NAMEWIDTH}>
          <b>Column</b>
        </Grid.Column>
        <Grid.Column width={TRANSFORMERWIDTH}>
          <b>Transformer</b>
        </Grid.Column>
      </Grid.Row>
      {recipe.transformers.map((transformer, i) => (
        <Transformer
          key={"transformer" + i}
          i={i}
          transformers={recipe.transformers}
          setTransformers={(value) => setRecipe((recipe) => ({ ...recipe, transformers: value }))}
        />
      ))}
    </Grid>
  );
};

const Transformer = ({ i, transformers, setTransformers }) => {
  const [delayedName, setDelayedName] = useState("");

  useEffect(() => {
    setDelayedName(transformers[i].column);
  }, [transformers, i]);

  useEffect(() => {
    if (delayedName === transformers[i].column) return;
    const timer = setTimeout(() => {
      transformers[i].column = delayedName;
      setTransformers([...transformers]);
    }, 500);
    return () => clearTimeout(timer);
  }, [delayedName, i, transformers, setTransformers]);

  const setTransformer = (value) => {
    transformers[i].transformer = value;
    transformers[i].arguments = transformerFunctions[value].arguments.map((arg) => arg.default);
    setTransformers([...transformers]);
  };

  const setArgs = (value) => {
    transformers[i].arguments = value;
    setTransformers([...transformers]);
  };

  return (
    <>
      <Grid.Row style={{ padding: "1px 0" }}>
        <Grid.Column width={NAMEWIDTH} style={{ paddingRight: "0" }}>
          <Input
            fluid
            placeholder="column"
            value={delayedName}
            onChange={(e, d) => setDelayedName(d.value)}
          />
        </Grid.Column>
        <Grid.Column width={TRANSFORMERWIDTH}>
          <Dropdown
            fluid
            selection
            options={options}
            value={transformers[i].transformer}
            onChange={(e, d) => setTransformer(d.value)}
          />
        </Grid.Column>
      </Grid.Row>
      <TransformerArguments
        transformer={transformers[i].transformer}
        args={transformers[i].arguments}
        setArgs={setArgs}
      />
    </>
  );
};

const TransformerArguments = React.memo(({ transformer, args, setArgs }) => {
  const setValue = (i, value) => {
    const newArgs = [...args];
    if (newArgs[i] === value) return;
    newArgs[i] = value;
    setArgs(newArgs);
  };

  if (!transformerFunctions?.[transformer]?.arguments) return null;
  return (
    <Grid.Row style={{ padding: "0", marginLeft: "30px" }}>
      <Grid.Column
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignContent: "stretch",
        }}
      >
        {transformerFunctions[transformer].arguments.map((arg, i) => {
          return (
            <Form.Field
              style={{ paddingRight: "5px", flex: arg.type === "bool" ? "0 1 auto" : "1 1 auto" }}
            >
              <label style={{ fontSize: "0.7em", marginBottom: "0" }}>{arg.name}</label>
              <ArgInput arg={arg} value={args[i]} setValue={(value) => setValue(i, value)} />
            </Form.Field>
          );
        })}
      </Grid.Column>
    </Grid.Row>
  );
});

const ArgInput = ({ arg, value, setValue }) => {
  const [delayed, setDelayed] = useState(value);

  useEffect(() => {
    setDelayed(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(delayed);
    }, 500);
    return () => clearTimeout(timer);
  }, [delayed, setValue]);

  switch (arg.type) {
    case "string":
      return <Input size="mini" value={delayed} onChange={(e, d) => setDelayed(d.value)} fluid />;
    case "bool":
      return (
        <Checkbox size="mini" checked={delayed} onChange={(e, d) => setDelayed(d.checked)} toggle />
      );
    case "option":
      const options = arg.options.map((a) => ({ key: a, value: a, text: a }));
      return (
        <Dropdown
          selection
          options={options}
          value={delayed}
          onChange={(e, d) => setDelayed(d.value)}
        />
      );
    default:
      return null;
  }
};

export default CreateTransformers;
