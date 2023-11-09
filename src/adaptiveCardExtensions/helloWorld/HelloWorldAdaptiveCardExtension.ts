import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { HelloWorldPropertyPane } from './HelloWorldPropertyPane';

export interface IHelloWorldAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IHelloWorldAdaptiveCardExtensionState {
  description: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'HelloWorld_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'HelloWorld_QUICK_VIEW';

export default class HelloWorldAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IHelloWorldAdaptiveCardExtensionProps,
  IHelloWorldAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: HelloWorldPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {
      description: this.properties.description
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'HelloWorld-property-pane'*/
      './HelloWorldPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.HelloWorldPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
