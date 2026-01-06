declare module "kuroshiro" {
  export default class Kuroshiro {
    init(analyzer: any): Promise<void>;
    convert(
      text: string,
      options: { to: string; mode: string }
    ): Promise<string>;
  }
}
