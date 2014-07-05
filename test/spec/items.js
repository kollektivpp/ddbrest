/*jshint -W030 */

var identifier = 'OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF',
    identifierWithChildren = 'IWOE72T2J3MNATFBPFV3PI3JQ3S3UXEL';

describe('items method', function() {

    this.timeout(100000);

    before(function() {
        should.exist(api.items);
    });

    describe('should throw an error', function() {

        it('if method gets initialised without required parameters', function() {
             api.items.bind(null).should.throw();
        });

        it('if parameter is not typeof string', function() {
             api.items.bind(null, 1).should.throw();
             api.items.bind(null, {}).should.throw();
             api.items.bind(null, []).should.throw();
             api.items.bind(null, true).should.throw();
             api.items.bind(null, function(){}).should.throw();
        });

    });

    describe('should provide an aip method that', function() {

        before(function() {
            should.exist(api.items(identifier).aip);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).aip.bind(null, function(){}).should.throw();
        });

        it('should return a JSON list of aips', function() {
            return api.items(identifier).aip().should.be.eventually.a('object').then(function(item) {
                item.properties['item-id'].should.be.deep.equal(identifier);
            });
        });

    });

    describe('should provide a binaries method that', function() {

        before(function() {
            should.exist(api.items(identifier).binaries);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).binaries.bind(null, function(){}).should.throw();
        });

        it('should return a JSON list of binaries', function() {
            return api.items(identifier).binaries().should.be.eventually.a('object').then(function(result) {
                should.exist(result.binary);
                result.binary.should.be.an.instanceOf(Array);
                result.binary[0]['@path'].should.be.deep.equal('/binary/' + identifier + '/list/1.jpg');
            });
        });

    });

    describe('should provide a children method that', function() {

        before(function() {
            should.exist(api.items(identifier).children);
        });

        it('should return a JSON list of children', function() {
            return api.items(identifierWithChildren).children().should.be.eventually.a('object').then(function(res) {
                should.exist(res.hierarchy);
                res.hierarchy.should.be.an.instanceOf(Array);
                res.hierarchy[0].parent.should.be.deep.equal(identifierWithChildren);
                res.hierarchy[0].id.should.be.deep.equal('5FKKRMD437OERWOZXR35G22UWMUSLD3O');
            });
        });

        it('should return one single children by passing an row attribute', function() {
            api.items(identifierWithChildren).children(null, 1).should.be.eventually.a('object').then(function(result) {
                should.exist(result.hierarchy);
                result.hierarchy.should.have.lengthOf(1);
            });
        });

        it('should return the third element by passing an offset attribute', function() {
            api.items(identifierWithChildren).children(2, 1).should.be.eventually.a('object').then(function(result) {
                should.exist(result.hierarchy);
                result.hierarchy.should.be.an.instanceOf(Array);
                result.hierarchy[0].parent.should.be.deep.equal(identifierWithChildren);
                result.hierarchy[0].id.should.be.deep.equal('QCCEYVUXL3XVW5VBXH4TVT3SUUNP6KEA');
            });
        });

    });

    describe('should provide an edm method that', function() {

        before(function() {
            should.exist(api.items(identifier).edm);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).edm.bind(null, function(){}).should.throw();
        });

        it('should return a JSON list of edms', function() {
            return api.items(identifier).edm().should.be.eventually.a('object').then(function(result) {
                should.exist(result.RDF);
                result.RDF.Place.prefLabel.should.be.deep.equal('Paderborn');
            });
        });

    });

    describe('should provide an indexingProfile method that', function() {

        before(function() {
            should.exist(api.items(identifier).indexingProfile);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).indexingProfile.bind(null, function(){}).should.throw();
        });

        it('should return a JSON list of facets', function() {
            return api.items(identifier).indexingProfile().should.be.eventually.a('object').then(function(result) {
                should.exist(result.facet);
                result['item-id'].should.be.deep.equal(identifier);
                result.facet[1].value.should.be.deep.equal('Paderborn');
            });
        });

    });

    describe('should provide an parents method that', function() {

        before(function() {
            should.exist(api.items(identifier).parents);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).parents.bind(null, function(){}).should.throw();
        });

        it('should return a JSON list of parents', function() {
            return api.items(identifier).parents().should.be.eventually.a('object').then(function(result) {
                should.exist(result.hierarchy);
                result.hierarchy[0].id.should.be.deep.equal(identifier);
                result.hierarchy[1].id.should.be.deep.equal(identifierWithChildren);
            });
        });

    });

    describe('should provide an source method that', function() {

        before(function() {
            should.exist(api.items(identifier).source);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).source.bind(null, function(){}).should.throw();
        });

        it('should return a JSON list of source', function() {
            // TODO source returns XML but should be json for consistency reasons
            return api.items(identifier).source().should.be.eventually.a('string');
        });

    });

    describe('should provide an view method that', function() {

        before(function() {
            should.exist(api.items(identifier).view);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).view.bind(null, function(){}).should.throw();
        });

        it('should return a JSON list of view', function() {
            return api.items(identifier).view().should.be.eventually.a('object').then(function(result) {
                should.exist(result.item);
                result.item.identifier.should.be.deep.equal('1003104487');
            });
        });

    });

});