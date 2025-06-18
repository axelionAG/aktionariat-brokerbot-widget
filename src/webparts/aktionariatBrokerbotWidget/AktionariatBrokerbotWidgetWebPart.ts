import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./AktionariatBrokerbotWidgetWebPart.module.scss";
import * as strings from "AktionariatBrokerbotWidgetWebPartStrings";

export interface IAktionariatBrokerbotWidgetWebPartProps {
  ticker: string;
}

export default class AktionariatBrokerbotWidgetWebPart extends BaseClientSideWebPart<IAktionariatBrokerbotWidgetWebPartProps> {
  public async render(): Promise<void> {
    await import(
      /* webpackIgnore: true, webpackChunkName: 'brokerbot-v3' */ "https://hub.aktionariat.com/brokerbot-v3/brokerbot-v3.mjs"
    );

    await import(
      /* webpackIgnore: true, webpackChunkName: 'shareholder-registration-v2' */ "https://hub.aktionariat.com/widgets/shareholder-registration-v2.mjs"
    );

    this.domElement.innerHTML = `
    <section class="${styles.aktionariatBrokerbotWidget}">
      <div>
        <akt-brokerbot ticker="${escape(
          this.properties.ticker
        )}" id="brokerbot"></akt-brokerbot>
      </div>
    </section>`;
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("ticker", {
                  label: strings.TickerFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
