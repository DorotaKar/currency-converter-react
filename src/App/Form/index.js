import { useState } from "react";
import { useRatesData } from "./useRatesData";
import { Result } from "./Result";
import {
  LabelText,
  Fieldset,
  FormButton,
  Legend,
  Input,
  FormField,
  Loading,
  Failure,
  Container,
} from "./styled";

export const Form = ({ title }) => {
  const [result, setResult] = useState();
  const ratesData = useRatesData();

  const calculateResult = (currency, amount) => {
    const rate = ratesData.rates[currency].value;

    setResult({
      sourceAmount: +amount,
      targetAmount: amount / rate,
      currency,
    });
  };

  const [currency, setCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");

  const onFormSubmit = (event) => {
    event.preventDefault();
    calculateResult(currency, amount);
  };

  return (
    <form onSubmit={onFormSubmit}>
      <Fieldset>
        <Legend>{title}</Legend>
        {ratesData.state === "loading" ? (
          <Container>
            <Loading>ŁADOWANIE...</Loading>
          </Container>
        ) : ratesData.state === "error" ? (
          <Container>
            <Failure>
              BŁĄD
              <br />
              sprawdź połączenie z internetem
            </Failure>
          </Container>
        ) : (
          <Container>
            <p>
              <LabelText>
                Waluta:
                <Input
                  as="select"
                  name="currency"
                  value={currency}
                  onChange={({ target }) => setCurrency(target.value)}
                >
                  {Object.keys(ratesData.rates).map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </Input>
              </LabelText>
            </p>
            <p>
              <LabelText>
                *Kwota:
                <Input
                  name="currency"
                  value={amount}
                  onChange={({ target }) => setAmount(target.value)}
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                />
              </LabelText>{" "}
            </p>
            <FormField>* pole wymagane</FormField>
            <FormButton>Przelicz!</FormButton>
            <Result result={result} />
          </Container>
        )}
      </Fieldset>
    </form>
  );
};
