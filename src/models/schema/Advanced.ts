type False = "0";
type True = "1";
type If<C extends True | False, Then, Else> = { "0": Else; "1": Then }[C];

type Diff<T extends string | number | symbol, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];

type X<T> = Diff<keyof T, keyof Object>;

type Is<T, U> = (Record<X<T & U>, False> & Record<any, True>)[Diff<X<T>, X<U>>];

type DeepPartial<T> = {
  [P in keyof T]?: If<Is<Function & T[P], Function>, T[P], DeepPartial<T[P]>>;
};

type Customer = {
  name: string;
  address: {
    line1: string;
    city: string;
    props: { [key: string]: string };
  };
};

type Props = { [key: string]: string };
const props: Props = { 1: "a" };

type C1 = DeepPartial<Customer>;

const c1: C1 = {
  name: "John",
  address: {
    line1: "66 Collins St",
    props: {
      1: "foo"
    }
  }
};

type Foo = {
  type: "foo";
  foo: string;
};

type Bar = {
  type: "bar";
  bar: number;
};

type Baz = Foo | Bar;
const baz: Baz = {
  type: "foo",
  foo: "string"
};
